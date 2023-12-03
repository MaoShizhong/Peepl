import { useOutletContext } from 'react-router-dom';

export function Feed() {
    const { user } = useOutletContext();

    return (
        <main>
            <form>
                <textarea
                    aria-label="new post"
                    name="post"
                    placeholder={`What's on your mind, ${user.details.firstName}?`}
                ></textarea>
                <button>Post</button>
            </form>
            <h1>Your feed</h1>
        </main>
    );
}
