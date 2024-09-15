import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import RangeSelector from './RangeSelector';
import { Product, SelectionChangeEvent } from '../types/types';
import { Paginator } from 'primereact/paginator';



export default function CheckboxRowSelectionDemo() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [remainingRange, setremainingRange] = useState<number | null>(null)
    const rowsPerPage = 12


    // fetching api
    const fetchProducts = async (page: number) => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page + 1}&limit=${rowsPerPage}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            const artworks = data.data.map((artwork: any) => ({
                id: artwork.id,
                title: artwork.title,
                place_of_origin: artwork.place_of_origin || 'Unknown',
                artist_display: artwork.artist_display || 'Unknown',
                inscriptions: artwork.inscriptions || 'None',
                date_start: artwork.date_start ? artwork.date_start.toString() : 'Unknown',
                date_end: artwork.date_end ? artwork.date_end.toString() : 'Unknown',
            }));

            if (remainingRange) {
                const selectedRange = artworks.slice(0, remainingRange);
                setremainingRange(remainingRange - selectedRange.length)
                setSelectedProducts((prevSelected) => {
                    const newSelection = [...prevSelected, ...selectedRange];
                    const uniqueSelection = Array.from(new Set(newSelection.map(item => item.id)))
                        .map(id => newSelection.find(item => item.id === id)!);
                    return uniqueSelection;
                });
            }

            setProducts(artworks);
            setTotalRecords(data.pagination.total);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);



    // hendling selection logic
    const handleRangeSelection = async (range: number) => {

        if (range > rowsPerPage) {
            setremainingRange(range - rowsPerPage)
        }
        const endIndex = Math.min(range, products.length);

        const selectedRange = products.slice(0, endIndex);
        setSelectedProducts((prevSelected) => {
            const newSelection = [...prevSelected, ...selectedRange];
            const uniqueSelection = Array.from(new Set(newSelection.map(item => item.id)))
                .map(id => newSelection.find(item => item.id === id)!);
            return uniqueSelection;
        });
    };

    const handlePageChange = (event: any) => {
        setCurrentPage(event.page);
    };


    const handleSelectionChange = (e: SelectionChangeEvent) => {
        setSelectedProducts(e.value);
    };

    return (
        <div className="card">

            {loading ?
                <div className='text-center flex justify-center items-center m-auto w-full animate-pulse text-5xl font-medium text-blue-700'>
                    Loading...
                </div> : error ?
                    <div className='text-red-500 flex justify-center items-center w-full'>Error: {error}</div> : (
                        <>
                            <DataTable
                                value={products}
                                rows={rowsPerPage}
                                totalRecords={totalRecords}
                                selectionMode="multiple"
                                selection={selectedProducts}
                                onSelectionChange={handleSelectionChange}
                                dataKey="id"
                                tableStyle={{ minWidth: '10rem' }}
                                className="custom-table"

                            >
                                <Column
                                    header={<div><RangeSelector onRangeSelect={handleRangeSelection} /></div>}
                                    headerStyle={{ width: '1px', textAlign: 'center', padding: '0px' }}
                                />
                                <Column
                                    selectionMode="multiple"
                                    headerStyle={{ width: '12rem' }}
                                />
                                <Column field="title" header="Title" />
                                <Column field="place_of_origin" header="Place of Origin" />
                                <Column field="artist_display" header="Artist" />
                                <Column field="inscriptions" header="Inscriptions" />
                                <Column field="date_start" header="Date Start" />
                                <Column field="date_end" header="Date End" />
                            </DataTable>

                            <Paginator
                                first={currentPage * rowsPerPage}
                                rows={rowsPerPage}
                                totalRecords={totalRecords}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
        </div>
    );
}
