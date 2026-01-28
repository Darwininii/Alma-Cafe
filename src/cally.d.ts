import "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "calendar-range": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string;
        class?: string;
        ref?: any;
      };
      "calendar-month": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        startDate?: string;
      };
      "calendar-date": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string;
        min?: string;
        max?: string;
      };
    }
  }
}
