type HeaderProps_TP = {
  header: string
  className?: string
  
}

export const Header = ({ header, className }: HeaderProps_TP) => {
  return <h3 className={`font-bold ${className}`}>{header}</h3>
}
