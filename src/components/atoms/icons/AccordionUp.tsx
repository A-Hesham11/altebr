type AccordionUpProps = { color: string }

export const AccordionUp = ({ color }: AccordionUpProps) => {
  return (
    <div
      className={`rounded-full  border border-${color} w-7 h-7 flex items-center justify-center`}
    >
      <svg
        aria-hidden="true"
        data-reactid="265"
        fill="none"
        height="24"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </div>
  )
}
