const footerStyles = {
    backgroundColor: 'purple',
    padding: '30px',
    color: 'white',
}

function Footer() {
    return (
        <footer style={footerStyles} className="Footer">
            <div className="has-text-centered">
                <p className="justify-between">
                    <span class="text-padding">&copy; Copyright by DoodleDreams</span>

                    <a href="https://github.com/nadavgl/doodle_dreams_project3" className="git">
                        <img className="git" src="./images/github-white.png" alt="" /></a>
                </p>
            </div>

        </footer>

    )
}

export default Footer;