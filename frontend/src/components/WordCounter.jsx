
// Show how many times search word was mentioned 
export default function WordCounter({ searchWord, searchCount }) {
    return (
        <div className="text-center mb-4">
            <p>
                The CS kids have <strong>{searchWord}ed</strong> <strong>{searchCount}</strong> times! Huzzah!
            </p>
            <img
                src="https://i0.wp.com/www.onegreenplanet.org/wp-conten…erstock-558636937-e1708704946288.jpg?w=1600&ssl=1https://www.onegreenplanet.org/wp-content/uploads/2024/02/shutterstock-558636937-e1708704946288.jpg"
                alt="Shower cat"
                style={{ maxWidth: '100%', marginTop: '10px' }}
            />
        </div>
    );
}
