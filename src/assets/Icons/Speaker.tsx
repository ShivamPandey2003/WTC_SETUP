
interface SpeakerProp {
    size:number
    className?: string
}

const Speaker = ({size,className}: SpeakerProp) => {
  return (
    <svg
      width={size}
      height={size * 17 / 16}
      fill="currentColor"
      viewBox="0 0 16 17" // passes color, size, etc.
      className={className}
    >
      <path
        d="M8 8.5c2.367 0 4.286-1.903 4.286-4.25S10.367 0 8 0C5.633 0 3.714 1.903 3.714 4.25S5.633 8.5 8 8.5zm3.208 1.082l-1.6 6.355-1.072-4.515 1.071-1.86H6.393l1.071 1.86-1.071 4.515-1.6-6.355C2.404 9.695.5 11.632.5 14.025v1.381A1.6 1.6 0 002.107 17h11.786a1.6 1.6 0 001.607-1.594v-1.381c0-2.394-1.905-4.33-4.292-4.443z"
      />
    </svg>
  );
};

export default Speaker;
