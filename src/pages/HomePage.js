import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketService from '../services/MarketService';
import CampaignService from '../services/CampaignService';
import styles from '../assets/styles/HomePage.module.css';
import backgroundImg from '../assets/images/default_background_image.png'

function HomePage() {
    const [market, setMarket] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMarketDetails = async () => {
            try {
                const marketData = await MarketService.getMarketById(1); // Replace with actual marketId
                setMarket(marketData);
                
                const campaignData = await CampaignService.getCampaignsByMarketId(1, 0, 3); // Fetch 3 recent campaigns
                setCampaigns(campaignData.content || []);
            } catch (error) {
                console.error('Failed to fetch market and campaign details:', error);
            }
        };

        fetchMarketDetails();
    }, []);

    const handleCampaignClick = (campaignId) => {
        navigate(`/campaign/${campaignId}`);
    };

    return (
        <div className={styles.homeContainer}>
            {market ? (
                <div className={styles.marketInfo}>
                    <img src={(market.imageUrls && market.imageUrls[0]) || backgroundImg} alt={market.companyName} className={styles.marketImage} />
                    <div className={styles.marketOverlay}>
                        <h1>{market.companyName}</h1>
                        <p>{market.description}</p>
                    </div>
                </div>
            ) : (
                <p>Market information is not available.</p>
            )}

            <div className={styles.campaignSection}>
                <h2>Recent Campaigns</h2>
                <div className={styles.campaignList}>
                    {campaigns.length > 0 ? (
                        campaigns.map((campaign) => (
                            <div key={campaign.id} className={styles.campaignCard} onClick={() => handleCampaignClick(campaign.id)}>
                                <img src={(campaign.imageUrls && campaign.imageUrls[0]) || backgroundImg} alt={campaign.title} className={styles.campaignImage} />
                                <div className={styles.campaignData}>
                                    <h3>{campaign.title}</h3>
                                    <p>{campaign.description}</p>
                                    <p><strong>기간:</strong> {new Date(campaign.startDate).toLocaleDateString()} ~ {new Date(campaign.endDate).toLocaleDateString()}</p>
                                    <div className={`${styles.status} ${new Date(campaign.endDate) > new Date() ? styles.ongoing : styles.ended}`}>
                                        {new Date(campaign.endDate) > new Date() ? '진행중' : '종료됨'}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No recent campaigns available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;