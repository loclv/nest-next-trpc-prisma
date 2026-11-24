import Link from "next/link";

const Navigation = () => {
	return (
		<nav className="bg-gray-800 py-4">
			<div className="container mx-auto">
				<ul className="flex space-x-4">
					<li>
						<Link href="/">Home</Link>
					</li>
					<li>
						<Link href="/about">About</Link>
					</li>
					<li>
						<Link href="/contact">Contact</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default Navigation;
