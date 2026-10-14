import { MonitorIcon, MoonStarIcon, SunIcon } from 'lucide-react'
import { useTernaryDarkMode, type TernaryDarkMode } from 'usehooks-ts'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export default function ThemeSwitch() {
  const { isDarkMode, ternaryDarkMode, setTernaryDarkMode } =
    useTernaryDarkMode({
      // For SSR usage
      // @see https://github.com/juliencrn/usehooks-ts/issues/644
      initializeWithValue: false,
    })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title="Theme Preference"
        aria-label={ternaryDarkMode}
        className="opacity-80 hover:opacity-100 focus-visible:opacity-100"
      >
        {isDarkMode ? (
          <MoonStarIcon className="size-5" />
        ) : (
          <SunIcon className="size-5" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={ternaryDarkMode}
          onValueChange={(value) => {
            setTernaryDarkMode(value as TernaryDarkMode)
            window.applyTheme?.(value as TernaryDarkMode)
          }}
        >
          <DropdownMenuRadioItem value="light">
            <SunIcon className="mr-2 size-4" />
            Light
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="dark">
            <MoonStarIcon className="mr-2 size-4" />
            Dark
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="system">
            <MonitorIcon className="mr-2 size-4" />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
