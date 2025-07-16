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
    <div className="border p-4 rounded mb-6">
      <p className="font-semibold mb-2">
        {index + 1}. {question}
      </p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <label key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name={`q-${index}`}
              value={i}
              checked={value === i}
              onChange={() => onChange(i)}
              required
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
