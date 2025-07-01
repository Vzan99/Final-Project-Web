"use client";

import { useState } from "react";
import API from "@/lib/axios";

type Question = {
  question: string;
  options: string[];
  answer: number;
};

type AssessmentFormProps = {
  onCreated?: () => void;
};

export default function AssessmentForm({ onCreated }: AssessmentFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [passingScore, setPassingScore] = useState(75);
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], answer: 0 },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], answer: 0 },
    ]);
  };

  const handleChangeQuestion = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleChangeOption = (qIdx: number, optIdx: number, value: string) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = value;
    setQuestions(updated);
  };

  const handleChangeAnswer = (qIdx: number, value: number) => {
    const updated = [...questions];
    updated[qIdx].answer = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return alert("Assessment name is required.");
    if (questions.length === 0) return alert("Add at least one question.");
    if (questions.some((q) => !q.question.trim())) {
      return alert("All questions must be filled.");
    }
    if (questions.some((q) => q.options.some((opt) => !opt.trim()))) {
      return alert("All answer options must be filled.");
    }

    try {
      await API.post("/assessments", {
        name,
        description,
        passingScore,
        timeLimit,
        questions,
      });

      alert("Assessment created!");
      onCreated?.(); // Notify parent

      // Reset form
      setName("");
      setDescription("");
      setPassingScore(75);
      setTimeLimit(30);
      setQuestions([{ question: "", options: ["", "", "", ""], answer: 0 }]);
    } catch (err) {
      console.error(err);
      alert("Failed to create assessment.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Assessment</h1>

      <div className="space-y-4">
        <input
          className="border p-2 w-full rounded"
          placeholder="Assessment Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="border p-2 w-full rounded"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex gap-4">
          <input
            type="number"
            min={0}
            className="border p-2 rounded w-full"
            placeholder="Passing Score"
            value={passingScore}
            onChange={(e) => setPassingScore(Number(e.target.value))}
          />
          <input
            type="number"
            min={1}
            className="border p-2 rounded w-full"
            placeholder="Time Limit (minutes)"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
          />
        </div>

        {questions.map((q, i) => (
          <div
            key={i}
            className="border p-4 rounded space-y-2 bg-gray-50 relative"
          >
            <p className="text-sm font-semibold text-gray-600">
              Question {i + 1}
            </p>

            <input
              className="border p-2 w-full"
              placeholder="Question text"
              value={q.question}
              onChange={(e) => handleChangeQuestion(i, e.target.value)}
            />

            {q.options.map((opt, j) => (
              <input
                key={j}
                className="border p-2 w-full"
                placeholder={`Option ${j + 1}`}
                value={opt}
                onChange={(e) => handleChangeOption(i, j, e.target.value)}
              />
            ))}

            <select
              className="border p-2 w-full"
              value={q.answer}
              onChange={(e) => handleChangeAnswer(i, Number(e.target.value))}
            >
              {q.options.map((_, j) => (
                <option key={j} value={j}>
                  Correct Answer: Option {j + 1}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleAddQuestion}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Add Question
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
