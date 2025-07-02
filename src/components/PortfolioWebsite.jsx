import React, { useEffect, useState } from 'react'
import ErrorPage from './ErrorPage';

export default function PortfolioWebsite({ website, header, hero, about, services, portfolio, team, testimonials, cta, footer, social }) {

    if (!website || !header || !hero || !about || !services || !portfolio || !team || !testimonials || !cta || !footer || !social) {
        return (<ErrorPage />);
    }

    const [previewHtml, setPreviewHtml] = useState('');
    const generatePreviewHtml = () => {
        const logoElement = website.logoUrl
            ? `<img src="${website.logoUrl}" alt="Logo" class="h-8 w-auto">`
            : `<div class="w-8 h-8 rounded-lg" style="background-color: ${website.primary_color};"></div>`;

        const navLinksHtml = header.navLinks && header.navLinks.map(link => `
            <a href="${link.href}" class="px-3 py-2 text-sm font-medium text-gray-300 hover:text-amber-400 transition-colors">${link.name}</a>
        `).join('');

        const headerHtml = `
            <header class="/80 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-800">
                <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <div class="flex items-center gap-3">
                        ${logoElement}
                        <span class="text-xl font-bold text-white">${hero.title}</span>
                    </div>
                    <nav class="hidden md:flex items-center">
                        ${navLinksHtml}
                    </nav>
                    <div class="hidden md:flex items-center gap-2">
                        <a href="#contact" class="px-4 py-2 text-sm font-semibold rounded-lg text-white transform hover:scale-105 transition-transform" style="background-color: ${website.primary_color};">${header.ctaButtonText}</a>
                    </div>
                </div>
            </header>
        `;

        const servicesHtml = services.items && services.items.map(item => `
            <div class="bg-gray-800/50 p-6 rounded-lg border border-gray-700 transform hover:-translate-y-1 transition-transform">
                <h4 class="text-xl font-bold text-white">${item.name}</h4>
                <p class="mt-2 text-gray-400">${item.description}</p>
            </div>
        `).join('');

        const portfolioHtml = portfolio.projects && portfolio.projects.map(project => `
            <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden group">
                <div class="h-48  flex items-center justify-center">
                    ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" class="w-full h-full object-cover">` : '<span class="text-gray-500">Project Image</span>'}
                </div>
                <div class="p-4">
                    <h4 class="text-lg font-bold text-white">${project.title}</h4>
                    <p class="mt-1 text-gray-400 text-sm">${project.description}</p>
                </div>
            </div>
        `).join('');

        const teamMembersHtml = team.members && team.members.map(member => `
            <div class="text-center transition-transform transform hover:-translate-y-2">
                <div class="w-32 h-32 mx-auto rounded-full bg-gray-800 overflow-hidden flex items-center justify-center border-4 border-gray-700/50">
                    ${member.imageUrl ? `<img src="${member.imageUrl}" alt="${member.name}" class="w-full h-full object-cover">` : `<span class="text-gray-500 text-xs">Photo</span>`}
                </div>
                <h4 class="mt-4 text-lg font-bold text-white">${member.name}</h4>
                <p class="text-sm" style="color: ${website.primary_color};">${member.title}</p>
            </div>
        `).join('');

        const testimonialsHtml = testimonials.items && testimonials.items.map(item => `
             <div class="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700/50">
                <p class="text-gray-300 italic">"${item.quote}"</p>
                <p class="mt-4 font-bold text-right text-gray-200">- ${item.author}</p>
            </div>
        `).join('');

        const smoothScrollScript = `
             document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });
        `;

        const defaultLinks = social && social.defaultLinks ? social.defaultLinks : [];
        const customLinks = social && social.customLinks ? social.customLinks : [];
        const allSocialLinks = [...defaultLinks, ...customLinks];
        const socialLinksHtml = allSocialLinks.map(link => `
            <a href="${link.url}" target="_blank" class="px-5 py-3 rounded-lg bg-[${website.primary_color}] hover:[${website.primary_color} / 30] font-semibold text-white no-underline transition-all transform hover:scale-105">${link.name}</a>
        `).join('');

        const html = `
            <!DOCTYPE html>
            <html lang="en" class="scroll-smooth">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${website.title}</title>
                <meta name="description" content="${website.description}">
                <script src="https://cdn.tailwindcss.com"><\/script>
                <style>
                    body { 
                        background-color: ${website.background_color};
                        color: ${website.text_color};
                        font-family: sans-serif;
                    }
                </style>
            </head>
            <body class="antialiased text-white">
                ${headerHtml}
                <main>
                    <section id="hero" class="text-center py-24 ">
                        <div class="container mx-auto px-4">
                            <h2 class="text-5xl font-extrabold" style="color: ${website.primary_color};">${hero.short_title}</h2>
                            <p class="max-w-2xl mx-auto mt-4 text-lg text-gray-300">${hero.description}</p>
                            <a href="#contact" class="mt-8 inline-block text-white px-8 py-3 rounded-lg transition-transform transform hover:scale-105" style="background-color: ${website.primary_color};">Get a Quote</a>
                        </div>
                    </section>
                    <section id="about" class="py-24">
                        <div class="container mx-auto px-4 text-center max-w-3xl">
                            <h3 class="text-4xl font-bold text-white">${about.title}</h3>
                            <div class="inline-block border-b-2 mt-2" style="border-color: ${website.primary_color}; width: 80px;"></div>
                            <p class="mt-4 text-gray-300 leading-relaxed">${about.description}</p>
                        </div>
                    </section>
                     <section id="services" class="py-24 ">
                        <div class="container mx-auto px-4 text-center">
                            <h3 class="text-4xl font-bold text-white">${services.title}</h3>
                             <div class="inline-block border-b-2 mt-2" style="border-color: ${website.primary_color}; width: 80px;"></div>
                            <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12 text-left">
                                ${servicesHtml}
                            </div>
                        </div>
                    </section>
                     <section id="portfolio" class="py-24">
                        <div class="container mx-auto px-4 text-center">
                            <h3 class="text-4xl font-bold text-white">${portfolio.title}</h3>
                             <div class="inline-block border-b-2 mt-2" style="border-color: ${website.primary_color}; width: 80px;"></div>
                            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12 text-left">
                                ${portfolioHtml}
                            </div>
                        </div>
                    </section>
                    <section id="team" class="py-24 ">
                        <div class="container mx-auto px-4 text-center">
                            <h3 class="text-4xl font-bold">${team.title}</h3>
                             <div class="inline-block border-b-2 mt-2" style="border-color: ${website.primary_color}; width: 80px;"></div>
                            <div class="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto mt-12">
                                ${teamMembersHtml}
                            </div>
                        </div>
                    </section>
                    <section id="testimonials" class="py-24">
                        <div class="container mx-auto px-4 text-center">
                             <h3 class="text-4xl font-bold text-white">${testimonials.title}</h3>
                             <div class="inline-block border-b-2 mt-2" style="border-color: ${website.primary_color}; width: 80px;"></div>
                             <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12 text-left">
                                ${testimonialsHtml}
                             </div>
                        </div>
                    </section>
                </main>
                <section id="contact" class="py-24 ">
                    <div class="container mx-auto text-center max-w-3xl">
                        <h2 class="text-4xl font-bold text-white">${cta.title}</h2>
                        <p class="mt-4 text-gray-300">${cta.description}</p>
                        <a href="#" class="mt-8 inline-block text-white px-8 py-4 rounded-lg text-lg font-semibold transition-transform transform hover:scale-105" style="background-color: ${website.primary_color};">Contact Us Today</a>
                        <div class="mt-8 flex flex-wrap justify-center gap-4">
                            ${socialLinksHtml}
                        </div>
                    </div>
                </section>
                <footer class="py-10 border-t border-gray-800 text-center text-gray-500 text-sm">
                    <div class="container mx-auto">
                        <p>${footer.copyright}</p>
                    </div>
                </footer>
                <script>
                    document.addEventListener('DOMContentLoaded', () => {
                        ${smoothScrollScript}
                    });
                <\/script>
            </body>
            </html>
        `;
        setPreviewHtml(html);
    };

    useEffect(() => {
        generatePreviewHtml();
    }, []);

    return (
        <main className="h-screen">
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="w-full h-full transform origin-center bg-white">
                    <iframe srcDoc={previewHtml} title="Live Preview" className="w-full h-full border-0" />
                </div>
            </div>
        </main>
    )
}
