import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "utils/axios";
import Pagination from "react-paginate";

export default function FilterHistoryTransaction() {
	const router = useRouter();
	const [totalPage, setTotalPage] = useState(0);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(7);
	const [receivers, setReceivers] = useState([]);
	const [showMenu, setShowMenu] = useState(false);

	const showMenuFilter = (text) => {
		if (showMenu === true) {
			setShowMenu(false);
		} else {
			setShowMenu(true);
		}
	};

	const getListReceiver = async () => {
		try {
			const response = await axios.get(
				`/transaction/history?page=${page}&limit=${limit}`
			);
			setTotalPage(response.data.pagination.totalPage);
			setReceivers(response.data.data);
		} catch (error) {
			new Error(error.response);
		}
	};

	const getTransactionHistoryReceiver = async (text) => {
		try {
			const response = await axios.get(
				`/transaction/history?page=${page}&limit=${limit}&filter=${
					text === "MONTH"
						? "MONTH"
						: text === "WEEK"
						? "WEEK"
						: text === "YEAR"
						? "YEAR"
						: null
				}`
			);
			router.push(`/home/dashboard?filter=${text}`);
			setShowMenu(false);
			setTotalPage(response.data.pagination.totalPage);
			setReceivers(response.data.data);
			return textTemp;
		} catch (error) {
			new Error(error.response);
		}
	};

	const changePagination = (event) => {
		const selectedPage = event.selected + 1;
		router.push(`/home/dashboard?page=${selectedPage}&limit=${limit}`);
		setPage(selectedPage, () => getListReceiver());
	};

	useEffect(() => {
		getListReceiver();
	}, [page, limit]);
	return (
		<>
			<div className="col">
				<section className="dashboard_filterhistory-main">
					<div className="dashboard_filterhistory-card">
						<div className="dashboard_filterhistory-card-header">
							<h4 className="dashboard_filterhistory-card-title">
								Transaction History
							</h4>

							<button
								className="dashboard_filterhistory-card-button"
								onClick={() => showMenuFilter("filter")}
							>
								--- Select Filter ---
							</button>
						</div>

						{showMenu ? (
							<div className="dashboard_filterhistory-card-filter">
								<span onClick={() => getTransactionHistoryReceiver("MONTH")}>
									Filter By Month
								</span>
								<hr />
								<span onClick={() => getTransactionHistoryReceiver("WEEK")}>
									Filter By Week
								</span>
								<hr />
								<span onClick={() => getTransactionHistoryReceiver("YEAR")}>
									Filter By Year
								</span>
							</div>
						) : null}

						{receivers.length > 0 ? (
							receivers.map((receiver) => (
								<div
									className="dashboard_filterhistory-card-body mt-4"
									key={receiver.id}
								>
									<img
										src={`${
											receiver.image
												? `${process.env.BASE_URL_PROD}/uploads/${receiver.image}`
												: "/images/face1.png"
										}`}
										width={56}
										height={56}
										alt="Profile Users"
									/>
									<div className="dashboard_filterhistory-card-body-description">
										<div className="mx-4">
											<h5 className="dashboard_filterhistory-card-body-name">
												{receiver.firstName} {receiver.lastName}
											</h5>
											<p className="dashboard_filterhistory-card-body-option">
												{receiver.type === "send" ? "Transfer" : receiver.type}
											</p>
										</div>
										<span
											className={` ${
												receiver.type === "send"
													? "dashboard_filterhistory-card-body-transfer-money"
													: "dashboard_filterhistory-card-body-accept-money"
											} `}
										>
											{receiver.type === "send"
												? `-Rp${new Intl.NumberFormat("id-ID").format(
														receiver.amount
												  )}`
												: `+Rp${new Intl.NumberFormat("id-ID").format(
														receiver.amount
												  )}`}
										</span>
									</div>
								</div>
							))
						) : (
							<p className="text-center fw-bold">Transaction not made</p>
						)}
						<Pagination
							previousLabel={"<"}
							nextLabel={">"}
							pageCount={totalPage}
							onPageChange={changePagination}
							containerClassName="transfer_list-receiers_pagination"
							activeClassName="transfer_list-receiers_pagination-active"
							previousClassName="transfer_list-receiers_pagination-previous"
							nextClassName="transfer_list-receiers_pagination-next"
							pageClassName="transfer_list-receiers_pagination-previous"
						/>
					</div>
				</section>
			</div>
		</>
	);
}
