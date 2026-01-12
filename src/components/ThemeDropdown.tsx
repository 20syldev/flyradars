import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const options = [
	{ value: 'system', label: 'Système', icon: Monitor },
	{ value: 'dark', label: 'Sombre', icon: Moon },
	{ value: 'light', label: 'Clair', icon: Sun },
] as const;

export function ThemeDropdown() {
	const { theme, setTheme } = useTheme();
	const currentOption = options.find(opt => opt.value === theme) || options[0];
	const CurrentIcon = currentOption.icon;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2 px-3 py-1.5 text-foreground">
					<CurrentIcon className="h-4 w-4"/>
					<span>{currentOption.label}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				<DropdownMenuRadioGroup
					value={theme}
					onValueChange={(value) => setTheme(value as typeof theme)}
				>
					{options.map(option => {
						const Icon = option.icon;
						return (
							<DropdownMenuRadioItem
								key={option.value}
								value={option.value}
								className="gap-2"
							>
								<Icon className="h-4 w-4"/>
								<span>{option.label}</span>
							</DropdownMenuRadioItem>
						);
					})}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
