const footerStyles = {
    backgroundColor: 'purple',
    padding: '30px',
    color: 'white',
}

function Footer() {
    return (
        <footer style={footerStyles} className="Footer">
            <div className="content has-text-centered">
                <p>&copy; Copyright by DoodleDreams</p>
            </div>

        </footer>

    )
}

export default Footer;