import React from 'react';

export default function HighlightedText({ text, queries, probs, result }) {
    const [hoveredWord, setHoveredWord] = React.useState(null);

    if (!queries || queries.length === 0) {
        return <>{text}</>; // queries가 없거나 빈 배열인 경우 원래 텍스트를 그대로 반환
    }
    const highlightColor = result === '스팸' ? '#ff9968' : '#99ccff';

    const highlight = (part) => {
        for (const query of queries) {
            if (part.toLowerCase().includes(query.toLowerCase())) {
                const regex = new RegExp(`(${query})`, 'ig');
                return part.split(regex).map((part, index) => (
                regex.test(part) ? (
                <span 
                    style={{ 
                        backgroundColor: highlightColor, 
                        position: 'relative', 
                        display: 'inline-block', 
                        margin: '2px 0px', 
                        borderRadius: '10px',
                        padding: '0px 5px'
                    }} 
                    key={index}
                    onMouseEnter={() => setHoveredWord(query)}
                    onMouseLeave={() => setHoveredWord(null)}>
                        {part}
                        {probs && probs[queries.indexOf(query)] && hoveredWord === query && (
                        <span
                            style={{
                                fontSize: 'small',
                                fontWeight: 'bold',
                                backgroundColor: '#DDDDDD',
                                padding: '2px 6px',
                                border: '0px',
                                borderRadius: '5px',
                                position: 'absolute',
                                left: '0%',
                                top: '-25px',
                                whiteSpace: 'nowrap', // 한 줄에 표시되도록 설정
                                zIndex: 9999 // 다른 요소보다 위로 뜨도록 설정
                            }}
                            >
                            확률: {probs[queries.indexOf(query)]}
                        </span>
                        )}
                    </span> 
                ) : part
                ));
            }
        }
        return part;
    };

    const parts = text.split(/\s+/); // 텍스트를 공백으로 나눠 단어들을 배열로 만듦

    return (
        <>
            {parts.map((part, index) => (
                <React.Fragment key={index}>{highlight(part)} </React.Fragment>
            ))}
        </>
    );
}