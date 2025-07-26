interface Props {
  index: number;
  question: string;
  options: string[];
  value: number | undefined;
  onChange: (value: number) => void;
}

export default function PreSelectionQuestionCard({
  index,
  question,
  options,
  value,
  onChange,
}: Props) {
  return (
    <div className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
      <p className="font-medium text-gray-800 mb-3">
        {index + 1}. {question}
      </p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <label
            key={i}
            className="flex items-center gap-2 cursor-pointer text-gray-700"
          >
            <input
              type="radio"
              name={`q-${index}`}
              value={i}
              checked={value === i}
              onChange={() => onChange(i)}
              required
              className="accent-blue-600"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
