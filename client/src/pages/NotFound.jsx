import React from "react";
const NotFound = () => {
    return (
        <div className ="flex flex-col items-center justify-center min-h-screen bg-background text-center">
            <img src="404_NotFound.png" alt="404 Not Found" className="max-w-full mb-4 w-96" />
            <h1 className="font-bold m-4 text-6xl">404</h1>
            <h2 className="text-xl mb-4">Trang bạn tìm kiếm không tồn tại</h2>
            <button onClick={() => history.back()} className="px-4 py-2 bg-primary text-white rounded transition rounded-2xl hover:bg-blue-950 shadow-lg">Quay về Trang chủ</button>
        </div>
    );

}

export default NotFound;