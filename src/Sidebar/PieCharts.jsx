import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const PieCharts = ({ data, platform }) => {
    let chartData;
    switch (platform) {
        case 'instagram':
            chartData = {
                labels: ['Comments', 'Likes', 'Shares', 'Saves', 'Reach'],
                datasets: [
                    {
                        label: 'Engagement Metrics',
                        data: [
                            data.comments || 0,
                            data.likes || 0,
                            data.shares || 0,
                            data.saved || 0,
                            data.reach || 0,
                        ],
                        backgroundColor: [
                            'rgba(245, 0, 53, 0.6)',
                            'rgba(0, 153, 255, 0.6)',
                            'rgba(255, 184, 3, 0.6)',
                            'rgba(9, 146, 146, 0.6)',
                            'rgba(154, 221, 29, 0.6)',
                        ],
                    },
                ],
            };
            break;
        case 'facebook':
            chartData = {
                labels: ['Total Comments', 'Love', 'Likes', 'Video Views', 'Impressions', 'Reactions'],
                datasets: [
                    {
                        label: 'Engagement Metrics',
                        data: [
                            data.total_comments || 0,
                            data.love || 0,
                            data.like || 0,
                            data.total_video_views || 0,
                            data.total_video_impressions || 0,
                            data.reactions || 0,
                        ],
                        backgroundColor: [
                            'rgba(245, 0, 53, 0.6)',
                            'rgba(0, 153, 255, 0.6)',
                            'rgba(255, 184, 3, 0.6)',
                            'rgba(9, 146, 146, 0.6)',
                            'rgba(107, 42, 238, 0.6)',
                            'rgba(154, 221, 29, 0.6)',
                        ],
                    },
                ],
            };
            break;
        case 'youtube':
            chartData = {
                labels: ['Comments', 'View Count', 'Like Count', 'Favorite Count', 'Dislike Count'],
                datasets: [
                    {
                        label: 'Engagement Metrics',
                        data: [
                            data.media_type && data.commentCount ? data.commentCount : 0,
                            data.media_type && data.viewCount ? data.viewCount : 0,
                            data.media_type && data.likeCount ? data.likeCount : 0,
                            data.media_type && data.favoriteCount ? data.favoriteCount : 0,
                            data.media_type && data.dislikeCount ? data.dislikeCount : 0,
                        ],
                        backgroundColor: [
                            'rgba(245, 0, 53, 0.6)',
                            'rgba(0, 153, 255, 0.6)',
                            'rgba(255, 184, 3, 0.6)',
                            'rgba(9, 146, 146, 0.6)',
                            'rgba(107, 42, 238, 0.6)',
                        ],
                    },
                ],
            };
            break;
        default:
            chartData = { labels: [], datasets: [] };
    }
    return (
        <>
            <h3 style={{ color: '#ba343b' }}>Graphical Representation</h3>
            <div style={{ height: '200px', marginTop: '15px' }}>
                <Pie
                    data={chartData}
                    options={{
                        plugins: {
                            legend: {
                                display: true,
                                position: 'right',
                            },
                        },
                        maintainAspectRatio: false,
                    }}
                />
            </div>
        </>
    );
};

export default PieCharts;