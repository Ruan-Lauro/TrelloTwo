import { FormEvent } from "react";

type FormProps = {
  children: React.ReactNode;
  onSubmit?: (e: FormEvent) => void;
  style: string;
}

const Form = ({ children, onSubmit, style }: FormProps) => {
  return (
    <form className={style} onSubmit={onSubmit}>
        {children}
    </form>
  )
}

export default Form