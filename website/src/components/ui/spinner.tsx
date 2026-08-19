import { cn } from "@/lib/utils"
import { IconLoaderOutline18 as LoaderIcon } from "nucleo-ui-outline-18/components/IconLoaderOutline18"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
