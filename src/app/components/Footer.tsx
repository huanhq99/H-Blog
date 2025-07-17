import Link from 'next/link'

const footerItem = { '首页': '/' }

export default function Footer() {
    return (
        <footer className="flex flex-col mt-20 bg-black w-full absolute left-0 right-0 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start">
                <div className="flex flex-wrap gap-2 text-white w-full md:w-auto">
                    {Object.entries(footerItem).map(([label, href]) => (
                        <Link key={href} className="hover:bg-white hover:text-black hover:rounded-md px-2 py-1" href={href}>{label}</Link>
                    ))}
                </div>
                <div className="flex flex-wrap gap-4 justify-start w-full md:w-auto mt-4 md:mt-0">
                    <Link href="https://nextjs.org" target="_blank" className="group relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><defs><linearGradient id="logosNextjsIcon0" x1="55.633%" x2="83.228%" y1="56.385%" y2="96.08%"><stop offset="0%" stopColor="#FFF" /><stop offset="100%" stopColor="#FFF" stopOpacity="0" /></linearGradient><linearGradient id="logosNextjsIcon1" x1="50%" x2="49.953%" y1="0%" y2="73.438%"><stop offset="0%" stopColor="#FFF" /><stop offset="100%" stopColor="#FFF" stopOpacity="0" /></linearGradient><circle id="logosNextjsIcon2" cx="128" cy="128" r="128" /></defs><mask id="logosNextjsIcon3" fill="#fff"><use href="#logosNextjsIcon2" /></mask><g mask="url(#logosNextjsIcon3)"><circle cx="128" cy="128" r="128" /><path fill="url(#logosNextjsIcon0)" d="M212.634 224.028L98.335 76.8H76.8v102.357h17.228V98.68L199.11 234.446a128 128 0 0 0 13.524-10.418" /><path fill="url(#logosNextjsIcon1)" d="M163.556 76.8h17.067v102.4h-17.067z" /></g></svg>
                    </Link>
                </div>
            </div>
            <hr className="my-8 border-zinc-700" />
            <div className="mb-6 flex flex-wrap w-full text-gray-500 text-sm">
                <p>本站由 <Link href="https://nextjs.org" target="_blank">Next.js</Link> & <Link href="https://payloadcms.com" target="_blank">Payload CMS</Link> 强力驱动。</p>
            </div>
        </footer>
    )
}