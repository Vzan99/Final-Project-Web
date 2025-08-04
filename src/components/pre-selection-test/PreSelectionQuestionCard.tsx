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
    <div className="border border-gray-300 p-4 rounded-lg shadow-sm mb-6 bg-white">
      <label className="font-semibold block mb-2 text-[#1a1a1a]">
        Question {index + 1}
      </label>

      <p className="text-sm text-gray-800 mb-3">{question}</p>

      <div className="grid grid-cols-1 gap-3">
        {options.map((opt, i) => (
          <label
            key={i}
            className="flex items-center gap-3 cursor-pointer text-gray-700"
          >
            <input
              type="radio"
              name={`q-${index}`}
              value={i}
              checked={value === i}
              onChange={() => onChange(i)}
              required
              className="accent-[#6096B4]"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
