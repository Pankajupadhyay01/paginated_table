import { useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

interface RangeSelectorProps {
    onRangeSelect: (range: number) => void;
}

export default function RangeSelector({ onRangeSelect }: RangeSelectorProps) {
    const op = useRef<OverlayPanel>(null);
    const [range, setRange] = useState<number>(0);

    const handleSubmit = () => {
        if (range > 0) {
            onRangeSelect(range);
            op.current?.hide();
        }
    };

    return (
        <div className="card flex justify-content-center">
            <Button className='bg-blue-600 text-white py-1' type="button" icon="pi pi-angle-down" onClick={(e) => op.current?.toggle(e)} />
            <OverlayPanel ref={op}>
                <div className='p-4'>
                    <input
                        type="number"
                        value={range}
                        className='p-2 border-2 border-blue-600'
                        onChange={(e) => setRange(parseInt(e.target.value))}
                        placeholder="Enter range"
                    />
                    <Button className='bg-blue-600 p-2 text-white' label="Submit" onClick={handleSubmit} />
                </div>
            </OverlayPanel>
        </div>
    );
}
