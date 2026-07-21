import React from "react";

class ErrorBoundary extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError() {
        return {
            hasError: true
        };
    }

    componentDidCatch(error, info) {
        console.error(error, info);
    }

    render() {

        if (this.state.hasError) {

            return (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        fontSize: "24px"
                    }}
                >
                    Something went wrong.
                </div>
            );

        }

        return this.props.children;

    }

}

export default ErrorBoundary;