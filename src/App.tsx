import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Plane, LayoutDashboard, Search, Eye } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeDropdown } from './components/ThemeDropdown';
import { SchemaTab } from './components/SchemaTab';
import { QueriesTab } from './components/QueriesTab';
import { ViewsTab } from './components/ViewsTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const tabs = [
	{ path: '/schema', label: 'Modélisation & Schéma', icon: LayoutDashboard },
	{ path: '/requetes', label: 'Requêtes SQL', icon: Search },
	{ path: '/vues', label: 'Vues SQL', icon: Eye },
];

function AppContent() {
	return (
		<div className="min-h-screen bg-background transition-colors duration-300">
			{/* Header */}
			<header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
								<Plane className="h-6 w-6"/>
							</div>
							<div>
								<h1 className="text-xl font-bold text-foreground">
									FlyRadars Manager
								</h1>
								<p className="text-sm text-muted-foreground">
									Interface de gestion de base de données
								</p>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<ThemeDropdown/>
							<Button variant="outline" size="sm" className="gap-2 px-3 py-1.5 dark:text-foreground">
								<span className="h-2 w-2 rounded-full bg-green-500"/>
								En ligne
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main layout */}
			<div className="mx-auto px-6 pt-8 pb-4">
				<div className="flex flex-col lg:flex-row gap-6">
					{/* Sidebar */}
					<aside className="lg:w-64 shrink-0 space-y-4">
						<Card>
							<CardContent className="p-2">
								<nav className="space-y-1">
									{tabs.map((tab) => {
										const Icon = tab.icon;
										return (
											<NavLink
												key={tab.path}
												to={tab.path}
												className={({ isActive }) =>
													`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors
													${isActive
														? 'bg-secondary text-secondary-foreground'
														: 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
													}`
												}
											>
												<Icon className="h-4 w-4"/>
												{tab.label}
											</NavLink>
										);
									})}
								</nav>
							</CardContent>
						</Card>

						{/* Quick stats */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
									Base de données
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-sm">
								<div className="flex justify-between text-muted-foreground">
									<span>Tables</span>
									<span className="font-semibold text-foreground">13</span>
								</div>
								<div className="flex justify-between text-muted-foreground">
									<span>Vues</span>
									<span className="font-semibold text-foreground">10</span>
								</div>
								<div className="flex justify-between text-muted-foreground">
									<span>Requêtes</span>
									<span className="font-semibold text-foreground">10</span>
								</div>
							</CardContent>
						</Card>
					</aside>

					{/* Main content */}
					<main className="flex-1 min-w-0">
						<Card className="min-h-[calc(100vh-12rem)] overflow-hidden">
							<CardContent className="p-6 overflow-hidden">
								<Routes>
									<Route path="/" element={<Navigate to="/schema" replace/>}/>
									<Route path="/schema" element={<SchemaTab/>}/>
									<Route path="/requetes" element={<QueriesTab/>}/>
									<Route path="/vues" element={<ViewsTab/>}/>
								</Routes>
							</CardContent>
						</Card>
					</main>
				</div>
			</div>

			{/* Footer */}
			<footer className="py-4 text-center text-sm text-muted-foreground">
				FlyRadars - Projet SLAM 2ème année
			</footer>
		</div>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<AppContent/>
			</ThemeProvider>
		</BrowserRouter>
	);
}