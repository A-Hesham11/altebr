import ReactPaginate from "react-paginate"

type PaginateProps = {
  pagesCount: number
  previousLabel?: string
  nextLabel?: string
  onPageChange: (page: number) => void
  initialPage: number
}

const Paginate = ({
  pagesCount,
  previousLabel,
  nextLabel,
  onPageChange,
  initialPage,
}: PaginateProps) => {

  return pagesCount > 1 ? (
    <ReactPaginate
      pageCount={pagesCount}
      previousLabel={previousLabel}
      nextLabel={nextLabel}
      onPageChange={(data) => onPageChange(data.selected)}
      initialPage={initialPage}
      containerClassName="flex gap-2 items-center"
      pageClassName="font-bold shadows-md py-2 px-4 shadows-md rounded-md"
      activeClassName={"bg-gray-200 text-black"}
      disabledClassName="[&>a]:text-gray-400 [&>a]:border-gray-400 [&>a]:cursor-not-allowed"
      previousLinkClassName="relative active:top-[1px] py-2 px-4 font-bold rounded-md text-mainGreen bg-white border-2 border-mainGreen"
      nextLinkClassName="relative active:top-[1px] py-2 px-4 font-bold rounded-md text-mainGreen bg-white border-2 border-mainGreen"
    />
  ) : null
}

export default Paginate
