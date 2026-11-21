import { useState, useEffect } from 'preact/hooks';
import { profile, setProfile, setQuizResults } from '../store/profile.js';
import ProgressBar from '../components/ProgressBar.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import questionsList from '../data/questions.json';
import centralSchemes from '../data/schemes/central.json';
import assamSchemes from '../data/schemes/assam.json';
import { rankSchemes } from '../engine/rank.js';

const allSchemes = [...centralSchemes, ...assamSchemes];

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(() => profile.value || {});
  const [isEvaluating, setIsEvaluating] = useState(false);

  const total = questionsList.length;
  const currQ = questionsList[currentStep];

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentStep]);

  const updateAnswer = (val) => {
    const updated = { ...answers, [currQ.field]: val };
    setAnswers(updated);
    setProfile(updated);
    return updated;
  };

  const finishAndRank = (finalAnswers) => {
    setIsEvaluating(true);
    setProfile(finalAnswers);
    setTimeout(() => {
      const ranked = rankSchemes(allSchemes, finalAnswers);
      setQuizResults({ ...ranked, answers: finalAnswers, timestamp: Date.now() });
      setIsEvaluating(false);
      window.location.hash = '#/results';
    }, 200);
  };

  const goNext = (updated) => {
    if (currentStep < total - 1) setCurrentStep(currentStep + 1);
    else finishAndRank(updated);
  };

  if (isEvaluating) {
    return (
      <div class="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div class="w-16 h-16 border-4 border-orange-200 border-t-[#FF9933] rounded-full animate-spin"></div>
        <h3 class="text-xl font-bold text-gray-800">Matching schemes for you…</h3>
        <p class="text-sm text-gray-500 max-w-sm">Evaluating eligibility criteria across Central and State government schemes</p>
      </div>
    );
  }

  return (
    <div class="py-8 px-4 sm:px-6 max-w-2xl mx-auto">
      <ProgressBar current={currentStep + 1} total={total} />
      {currQ && (
        <QuestionCard
          question={currQ}
          value={answers[currQ.field]}
          onChange={updateAnswer}
          onNext={() => goNext(answers)}
          onSkip={() => goNext(updateAnswer(null))}
          onBack={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
          isFirst={currentStep === 0}
          isLast={currentStep === total - 1}
        />
      )}
    </div>
  );
}
