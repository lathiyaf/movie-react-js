import React from 'react'
import ReactPaginate from 'react-paginate'

function NewPagination({ setCurrentPage, pageCount, currentPage }) {
    const changePage = ({ selected }) => {
        setCurrentPage(selected + 1);
    }
    let totalPages = pageCount;
    return (
        <>
            <ReactPaginate
                previousLabel={"Prev"}
                nextLabel={"Next"}
                pageCount={totalPages}
                breakLabel={"..."}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={changePage}
                disabledClassName={"paginationDisabled"}
                activeClassName={"active"}
                forcePage={currentPage - 1}
            />
        </>
    )
}

export default NewPagination
