export default function ScoreBar({ value }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-500">Confidence</span>
        <span className="font-medium text-slate-800">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-slate-900"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}