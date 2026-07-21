import { useEffect, useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";

import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import ExportButtons from "../../components/ExportButtons";
import StarRating from "../../components/StarRating";

import reviewService from "../../services/reviewService";

import "../../assets/css/pages/reviewManagement.css";

export default function ReviewManagement() {

    const [reviews, setReviews] = useState([]);
    const statistics = useMemo(() => {

        const totalReviews = reviews.length;

        const averageRating = totalReviews
            ? (
                reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                ) / totalReviews
            ).toFixed(1)
            : "0.0";

        const fiveStarReviews = reviews.filter(
            (review) => review.rating === 5
        ).length;

        const lowRatings = reviews.filter(
            (review) => review.rating <= 2
        ).length;

        return {

            totalReviews,

            averageRating,

            fiveStarReviews,

            lowRatings,

        };

    }, [reviews]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadReviews();

    }, []);

    const loadReviews = async () => {

        try {

            setLoading(true);

            const data =
                await reviewService.getAllReviews();

            setReviews(data || []);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const columns = [

        {
            header: "Sl No",
            render: (row, index) => index + 1,
        },

        {
            header: "User",
            accessor: "userName",
        },

        {
            header: "Technician",
            accessor: "technicianName",
        },

        {
            header: "Rating",

            render: (row) => (

                <StarRating
                    rating={row.rating}
                    readOnly
                />

            ),

        },

        {
            header: "Review",
            accessor: "review",
        },

        {
            header: "Date",

            render: (row) => {

                if (!row.reviewDate) {

                    return "-";

                }

                return new Date(row.reviewDate)
                    .toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }
                    );

            },

        },

    ];

    const excelData = reviews.map((review) => ({

        User: review.userName,

        Technician: review.technicianName,

        Rating: review.rating,

        Review: review.review,

        Date: review.reviewDate,

    }));

    const pdfColumns = [

        "User",

        "Technician",

        "Rating",

        "Review",

        "Date",

    ];

    const pdfRows = reviews.map((review) => [

        review.userName,

        review.technicianName,

        review.rating,

        review.review,

        review.reviewDate,

    ]);

    if (loading) {

        return (

            <Loader
                fullScreen
                text="Loading Reviews..."
            />

        );

    }

    return (

        <Layout title="Customer Reviews">

            <div className="review-page">

                <div className="review-header">

                    <div>

                        <h2>

                            <FaStar />

                            Customer Reviews

                        </h2>

                        <p>

                            View all customer feedback
                            submitted for completed
                            services.

                        </p>

                    </div>

                </div>
                <div className="review-stats">

                    <div className="row g-4">

                        <div className="col-lg-3 col-md-6">

                            <div className="review-stat-card">

                                <h5>Total Reviews</h5>

                                <h2>

                                    {statistics.totalReviews}

                                </h2>

                            </div>

                        </div>

                        <div className="col-lg-3 col-md-6">

                            <div className="review-stat-card">

                                <h5>Average Rating</h5>

                                <h2 className="rating">

                                    ⭐ {statistics.averageRating}

                                </h2>

                            </div>

                        </div>

                        <div className="col-lg-3 col-md-6">

                            <div className="review-stat-card">

                                <h5>5 Star Reviews</h5>

                                <h2>

                                    {statistics.fiveStarReviews}

                                </h2>

                            </div>

                        </div>

                        <div className="col-lg-3 col-md-6">

                            <div className="review-stat-card">

                                <h5>Low Ratings</h5>

                                <h2>

                                    {statistics.lowRatings}

                                </h2>

                            </div>

                        </div>

                    </div>

                </div>
                <ExportButtons
                    data={reviews}
                    excelData={excelData}
                    pdfColumns={pdfColumns}
                    pdfRows={pdfRows}
                    title="Customer Reviews"
                    fileName="Customer_Reviews"
                />

                <DataTable
                    columns={columns}
                    data={reviews}
                    searchable
                    searchKeys={[
                        "userName",
                        "technicianName",
                        "review",
                    ]}
                    searchPlaceholder="Search User, Technician, Review..."
                    pageSize={10}
                    emptyMessage="No Reviews Found."
                />

            </div>

        </Layout>

    );

}