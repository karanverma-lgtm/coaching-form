"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  SurveyAnswers,
  getEligibleQuestions,
  isQuestionRequired,
  ROLE_OPTIONS,
  QuestionDefinition,
} from "@/lib/survey/schema";
import { submitSurveyResponse } from "@/lib/firebase/survey-service";
import { SurveyHeader } from "./SurveyHeader";
import { SurveyWelcome } from "./SurveyWelcome";
import { TextInputQuestion } from "./TextInputQuestion";
import { SingleChoiceQuestion } from "./SingleChoiceQuestion";
import { MultiChoiceQuestion } from "./MultiChoiceQuestion";
import { LikertScaleQuestion } from "./LikertScaleQuestion";
import { OpenTextQuestion } from "./OpenTextQuestion";
import { SurveyNavigation } from "./SurveyNavigation";
import { SurveyReview } from "./SurveyReview";
import { SurveySuccess } from "./SurveySuccess";
import { HelpCircle, AlertCircle, Tag } from "lucide-react";

type SurveyStatus = "welcome" | "survey" | "review" | "success";

const SHORTCUT_KEYS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"];

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const SurveyContainer: React.FC = () => {
  const [status, setStatus] = useState<SurveyStatus>("welcome");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceiptId, setSubmittedReceiptId] = useState<string>("");
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Autosave / restore progress across sessions
  useEffect(() => {
    try {
      const saved = localStorage.getItem("survey_answers_draft") || sessionStorage.getItem("survey_answers_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setAnswers(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleUpdateAnswer = (
    id: string,
    value: string | string[] | number | undefined,
    otherText?: string
  ) => {
    setErrorMessage(null);
    setAnswers((prev) => {
      let updated: SurveyAnswers = { ...prev, [id]: value };
      if (otherText !== undefined) {
        updated[`${id}_OTHER`] = otherText;
      }

      // If modifying critical routing forks (Q05 Role or Q06 Coaching Exposure),
      // purge orphan answers that no longer belong to the newly eligible pathway.
      if (id === "Q05" || id === "Q06") {
        const newEligible = getEligibleQuestions(updated);
        const validIds = new Set(newEligible.map((q) => q.id));
        const cleaned: SurveyAnswers = {};
        for (const [key, val] of Object.entries(updated)) {
          const baseKey = key.endsWith("_OTHER") ? key.replace("_OTHER", "") : key;
          if (validIds.has(baseKey)) {
            cleaned[key] = val;
          }
        }
        updated = cleaned;
      }

      try {
        localStorage.setItem("survey_answers_draft", JSON.stringify(updated));
        sessionStorage.setItem("survey_answers_draft", JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  // Get active list of questions based on Q05 (Role) and Q06 (Coaching Exposure)
  const eligibleQuestions = useMemo(() => {
    return getEligibleQuestions(answers);
  }, [answers]);

  const currentQuestion: QuestionDefinition | undefined = eligibleQuestions[currentStepIndex];

  const currentRoleLabel = useMemo(() => {
    const roleVal = answers["Q05"];
    const otherVal = answers["Q05_OTHER"] as string | undefined;
    if (roleVal === "other" && otherVal?.trim()) {
      return `Other (${otherVal.trim()})`;
    }
    const found = ROLE_OPTIONS.find((r) => r.value === roleVal);
    return found ? found.label : undefined;
  }, [answers]);

  const isCurrentOptional = useMemo(() => {
    if (!currentQuestion) return false;
    return !isQuestionRequired(currentQuestion, answers);
  }, [currentQuestion, answers]);

  const isCurrentQuestionAnswered = useMemo(() => {
    if (!currentQuestion) return false;
    const val = answers[currentQuestion.id];
    if (val === undefined || val === null || val === "") return false;
    if (Array.isArray(val) && val.length === 0) return false;
    if (currentQuestion.type === "email") {
      return isValidEmail(String(val));
    }
    return true;
  }, [currentQuestion, answers]);

  const canAdvance = isCurrentOptional || isCurrentQuestionAnswered;

  // Step advancement helper
  const advanceToNext = (activeAnswers: SurveyAnswers = answers) => {
    setErrorMessage(null);
    const activeQuestions = getEligibleQuestions(activeAnswers);
    if (currentStepIndex < activeQuestions.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setStatus("review");
    }
  };

  // Navigation handlers
  const handleStart = () => {
    setStartTime(Date.now());
    setStatus("survey");
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (!currentQuestion) return;
    const val = answers[currentQuestion.id];
    const hasValue = val !== undefined && val !== null && val !== "" && (!Array.isArray(val) || val.length > 0);
    const isOptional = !isQuestionRequired(currentQuestion, answers);

    if (!isOptional && !hasValue) {
      setErrorMessage("Please enter an answer to continue.");
      return;
    }

    if (currentQuestion.type === "email" && hasValue && !isValidEmail(String(val))) {
      setErrorMessage("Please enter a valid work email address (e.g. name@company.com).");
      return;
    }

    advanceToNext(answers);
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else {
      setStatus("welcome");
    }
  };

  const handleSkip = () => {
    if (!currentQuestion) return;
    const updated = { ...answers };
    delete updated[currentQuestion.id];
    delete updated[`${currentQuestion.id}_OTHER`];
    setAnswers(updated);
    try {
      localStorage.setItem("survey_answers_draft", JSON.stringify(updated));
      sessionStorage.setItem("survey_answers_draft", JSON.stringify(updated));
    } catch {}
    advanceToNext(updated);
  };

  const handleEditQuestion = (index: number) => {
    setCurrentStepIndex(index);
    setStatus("survey");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
      const receiptId = await submitSurveyResponse({
        answers,
        timeSpentSeconds,
      });
      setSubmittedReceiptId(receiptId);
      setStatus("success");
      try {
        localStorage.removeItem("survey_answers_draft");
        sessionStorage.removeItem("survey_answers_draft");
      } catch {
        // Ignore
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit survey";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStepIndex(0);
    setStatus("welcome");
    setSubmittedReceiptId("");
    try {
      localStorage.removeItem("survey_answers_draft");
      sessionStorage.removeItem("survey_answers_draft");
    } catch {
      // Ignore
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      if (status === "welcome") {
        if (e.key === "Enter") {
          e.preventDefault();
          handleStart();
        }
        return;
      }

      if (status === "survey" && currentQuestion) {
        if (e.key === "Enter") {
          e.preventDefault();
          handleNext();
        } else if (e.key === "ArrowLeft" || (e.key === "Backspace" && !e.metaKey)) {
          if (currentStepIndex > 0) {
            e.preventDefault();
            handleBack();
          }
        } else if (currentQuestion.type === "single_select" && currentQuestion.options) {
          const keyLower = e.key.toLowerCase();
          const keyIndex = SHORTCUT_KEYS.indexOf(keyLower);
          if (keyIndex >= 0 && keyIndex < currentQuestion.options.length) {
            e.preventDefault();
            const chosen = currentQuestion.options[keyIndex];
            handleUpdateAnswer(currentQuestion.id, chosen.value);
          }
        } else if (currentQuestion.type === "multi_select" && currentQuestion.options) {
          const keyLower = e.key.toLowerCase();
          const keyIndex = SHORTCUT_KEYS.indexOf(keyLower);
          if (keyIndex >= 0 && keyIndex < currentQuestion.options.length) {
            e.preventDefault();
            const chosen = currentQuestion.options[keyIndex];
            const currentVals = (answers[currentQuestion.id] as string[]) || [];
            let nextVals: string[];
            if (
              chosen.value === "Not applicable" ||
              chosen.value === "None in particular" ||
              chosen.value === "No formal indicators"
            ) {
              nextVals = currentVals.includes(chosen.value) ? [] : [chosen.value];
            } else {
              const withoutExclusive = currentVals.filter(
                (v) => v !== "Not applicable" && v !== "None in particular" && v !== "No formal indicators"
              );
              if (withoutExclusive.includes(chosen.value)) {
                nextVals = withoutExclusive.filter((v) => v !== chosen.value);
              } else {
                if (currentQuestion.maxSelections && withoutExclusive.length >= currentQuestion.maxSelections) {
                  return;
                }
                nextVals = [...withoutExclusive, chosen.value];
              }
            }
            handleUpdateAnswer(currentQuestion.id, nextVals);
          }
        } else if (currentQuestion.type === "likert_5") {
          if (["1", "2", "3", "4", "5"].includes(e.key)) {
            e.preventDefault();
            handleUpdateAnswer(currentQuestion.id, Number(e.key));
          } else if (["0", "9", "n", "N"].includes(e.key)) {
            // Shortcut for "99: Not sure / Too early to assess"
            e.preventDefault();
            handleUpdateAnswer(currentQuestion.id, 99);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, currentQuestion, currentStepIndex, eligibleQuestions.length, answers]);

  return (
    <div className="relative min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-orange-500/20 selection:text-orange-900 dark:selection:bg-orange-500/30 dark:selection:text-orange-200 transition-colors duration-200 overflow-x-hidden">
      {/* Ambient Background: Subtle Grid Pattern + Ultra-Soft Warm Ambient Radiance */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle Architectural Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50 dark:opacity-25" />

        {/* Soft, Gentle Ambient Radial Gradient (Very Subtle & Elegant) */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-orange-400/[0.08] via-amber-300/[0.04] to-transparent dark:from-orange-500/[0.07] dark:via-amber-400/[0.03] dark:to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-amber-400/[0.04] dark:bg-amber-500/[0.03] rounded-full blur-3xl" />
      </div>

      {/* Top Brand & Progress Header (active during survey) */}
      {status === "survey" && currentQuestion && (
        <SurveyHeader
          currentStep={currentStepIndex}
          totalSteps={eligibleQuestions.length}
          sectionTitle={currentQuestion.sectionTitle}
          roleTitle={currentRoleLabel}
          onReset={handleReset}
        />
      )}

      {/* Main View Router */}
      <main className="relative z-10 flex-1 flex flex-col justify-start px-4 py-2 sm:py-4 overflow-y-auto">
        {status === "welcome" && <SurveyWelcome onStart={handleStart} />}

        {status === "survey" && currentQuestion && (
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-fadeIn space-y-6 my-auto">
            {/* Question Title & Badges */}
            <div className="w-full max-w-4xl text-left space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 shadow-xs">
                  {currentQuestion.id}
                </span>

                {/* Topic / Variable Tag Badge */}
                {currentQuestion.tag && (
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>{currentQuestion.tag}</span>
                  </span>
                )}

                {isCurrentOptional ? (
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">
                    Optional
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-800/60">
                    Required
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl sm:leading-snug font-bold text-zinc-900 dark:text-white tracking-tight">
                {currentQuestion.title}
              </h2>

              {currentQuestion.subtitle && (
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex items-start gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5" />
                  <span>{currentQuestion.subtitle}</span>
                </p>
              )}
            </div>

            {/* Question Interactive Component */}
            <div className="w-full">
              {(currentQuestion.type === "text" || currentQuestion.type === "email") && (
                <TextInputQuestion
                  value={(answers[currentQuestion.id] as string) || ""}
                  placeholder={currentQuestion.placeholder}
                  type={currentQuestion.type}
                  onChange={(val) => handleUpdateAnswer(currentQuestion.id, val)}
                  onEnter={handleNext}
                />
              )}

              {currentQuestion.type === "single_select" && currentQuestion.options && (
                <SingleChoiceQuestion
                  options={currentQuestion.options}
                  value={answers[currentQuestion.id] as string}
                  customOtherText={(answers[`${currentQuestion.id}_OTHER`] as string) || ""}
                  onChange={(val, otherText) => handleUpdateAnswer(currentQuestion.id, val, otherText)}
                />
              )}

              {currentQuestion.type === "multi_select" && currentQuestion.options && (
                <MultiChoiceQuestion
                  options={currentQuestion.options}
                  values={(answers[currentQuestion.id] as string[]) || []}
                  customOtherText={(answers[`${currentQuestion.id}_OTHER`] as string) || ""}
                  maxSelections={currentQuestion.maxSelections}
                  onChange={(vals, otherText) => handleUpdateAnswer(currentQuestion.id, vals, otherText)}
                />
              )}

              {currentQuestion.type === "likert_5" && currentQuestion.likertOptions && (
                <LikertScaleQuestion
                  options={currentQuestion.likertOptions}
                  value={answers[currentQuestion.id] as number}
                  onChange={(val) => handleUpdateAnswer(currentQuestion.id, val)}
                />
              )}

              {currentQuestion.type === "open_text" && (
                <OpenTextQuestion
                  value={(answers[currentQuestion.id] as string) || ""}
                  placeholder={currentQuestion.placeholder}
                  wordLimit={currentQuestion.wordLimit}
                  onChange={(val) => handleUpdateAnswer(currentQuestion.id, val)}
                />
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="w-full max-w-4xl p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Bottom Nav Bar */}
            <SurveyNavigation
              canGoBack={true}
              canAdvance={canAdvance}
              isOptional={isCurrentOptional}
              isLastQuestion={currentStepIndex === eligibleQuestions.length - 1}
              onBack={handleBack}
              onNext={handleNext}
              onSkip={isCurrentOptional ? handleSkip : undefined}
            />
          </div>
        )}

        {status === "review" && (
          <SurveyReview
            questions={eligibleQuestions}
            answers={answers}
            isSubmitting={isSubmitting}
            onEditQuestion={handleEditQuestion}
            onBack={() => {
              setCurrentStepIndex(eligibleQuestions.length - 1);
              setStatus("survey");
            }}
            onSubmit={handleSubmit}
          />
        )}

        {status === "success" && (
          <SurveySuccess receiptId={submittedReceiptId} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 text-center text-[11px] text-zinc-500">
        NHRD & xMonks • The Coaching Ripple Effect Research 2026 • Anonymous & Confidential
      </footer>
    </div>
  );
};
