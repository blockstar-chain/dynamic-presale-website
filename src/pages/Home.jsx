import React from 'react'
import { useParams } from 'react-router-dom';
import { useWebsiteStats } from 'src/stats/useWebsite';
import DynamicHead from '@components/DynamicHead';
import PresaleWebsite from '@components/PresaleWebsite';
import PortfolioWebsite from '@components/PortfolioWebsite';
import EcommerceWebsite from '@components/EcommerceWebsite';

export default function Home() {
    const { id } = useParams(); // get the id from the route
    const websiteStats = useWebsiteStats(id);


    return (
        <>
            <DynamicHead
                title={websiteStats?.website?.title}
                faviconBase64={websiteStats?.website?.logoUrl}
            />
            {websiteStats.loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin" />
                </div>
            )}
            {websiteStats.error ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

                    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                        <div class="mx-auto max-w-screen-sm text-center">
                            <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">404</h1>
                            <p class="mb-4 text-3xl tracking-tight font-bold text-white md:text-4xl dark:text-white">Something's missing.</p>
                            <p class="mb-4 text-lg font-light text-gray-200 dark:text-gray-400">Sorry, we can't find that page. </p>
                            <p className='text-2xl'>{websiteStats.error}</p>
                        </div>
                    </div>

                </div>

            ) : (
                <>
                    {
                        websiteStats && websiteStats.type === "presale_website" && (
                            <PresaleWebsite
                                error={websiteStats?.error}
                                loading={websiteStats?.loading}
                                website={websiteStats?.website}
                                header={websiteStats?.header}
                                hero={websiteStats?.hero}
                                about={websiteStats?.about}
                                team={websiteStats?.team}
                                info={websiteStats?.info}
                                tokenomics={websiteStats?.tokenomics}
                                howToBuy={websiteStats?.howToBuy}
                                dex={websiteStats?.dex}
                                presale={websiteStats?.presale}
                                roadmap={websiteStats?.roadmap}
                                social={websiteStats?.social}
                                cta={websiteStats?.cta}
                                footer={websiteStats?.footer}
                                chaininfo={websiteStats?.chaininfo}
                                presale_address={websiteStats?.presale_address}
                            />
                        )}

                    {websiteStats && websiteStats.type === "portfolio_website" && (
                        <PortfolioWebsite
                            error={websiteStats?.error}
                            loading={websiteStats?.loading}
                            website={websiteStats.website}
                            header={websiteStats.header}
                            hero={websiteStats.hero}
                            about={websiteStats.about}
                            services={websiteStats.services}
                            portfolio={websiteStats.portfolio}
                            team={websiteStats.team}
                            testimonials={websiteStats.testimonials}
                            cta={websiteStats.cta}
                            footer={websiteStats.footer}
                            social={websiteStats.social}
                        />
                    )}

                    {websiteStats && websiteStats.type === "ecommerce_website" && (
                        <EcommerceWebsite
                            error={websiteStats?.error}
                            loading={websiteStats?.loading}
                            website={websiteStats.website}
                            header={websiteStats.header}
                            hero={websiteStats.hero}
                            products={websiteStats.products}
                            categories={websiteStats.categories}
                            promo={websiteStats.promo}
                            reviews={websiteStats.reviews}
                            cta={websiteStats.cta}
                            footer={websiteStats.footer}
                            social={websiteStats.social}
                        />
                    )}
                </>
            )}

        </>
    );
}
