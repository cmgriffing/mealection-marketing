// Waiting on https://github.com/vechai/vechaiui/pull/68 to be merged or fixed in another way

import { Button, DefaultProps } from "@vechaiui/react";

interface IButtonProps extends DefaultProps {
  /* Shows loading spinner */
  loading?: boolean;
  /* Makes button disabled */
  disabled?: boolean;
  /* Makes button active */
  active?: boolean;
  /* The label to show in the button when loading is true */
  loadingText?: string;
  /* Set the original html type of button */
  type?: "button" | "reset" | "submit";
  /* Adds icon before button label */
  leftIcon?: React.ReactElement;
  /* Adds icon after button label */
  rightIcon?: React.ReactElement;
  /* Set the button color */
  color?: string;
  /* Size of the button */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Controls button appearance */
  variant?: "link" | "solid" | "outline" | "light" | "ghost";
  /* React node */
  children?: React.ReactNode;
  /* Form Input Name */
  name?: string;
  /* Form Input Value */
  value?: string | number;
}

export interface IExegeteButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    IButtonProps {}

type IExegeteButton = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<IExegeteButtonProps> &
    React.RefAttributes<HTMLButtonElement>
>;

export const ExegeteButton = Button as IExegeteButton;
