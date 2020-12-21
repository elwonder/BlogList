const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    return blogs.reduce((acc, x) => acc + x.likes, 0);
}

const favoriteBlog = (blogs) => {
    const reducer = (acc, x) => x.likes > acc.likes ? x : acc;

    const favorite = blogs.reduce(reducer, blogs[0]);

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    };
}

const mostBlogs = (blogs) => {
    const aggregationReducer = (acc, x) => {
        const author = acc.find(author => author.name === x.author);
        if (author) {
            author.blogs += 1;
        } else {
            const newAuthor = {
                name: x.author,
                blogs: 1,
            }
            acc.push(newAuthor);
        }
        return acc;
    }
    const selectionReducer = (acc, x) => x.blogs > acc.blogs ? x : blogs;

    const bestBlogger = blogs.reduce(aggregationReducer, []).reduce(selectionReducer, {author: '', blogs: -1});

    return {
        author: bestBlogger.name,
        blogs: bestBlogger.blogs
    }
}

const mostLikes = (blogs) => {
    const aggregationReducer = (acc, x) => {
        const author = acc.find(author => author.name === x.author);
        if (author) {
            author.likes += x.likes;
        } else {
            const newAuthor = {
                name: x.author,
                likes: x.likes,
            }
            acc.push(newAuthor);
        }
        return acc;
    }
    const selectionReducer = (acc, x) => x.likes > acc.likes ? x : acc;

    const bestBlogger = blogs.reduce(aggregationReducer, []).reduce(selectionReducer, {likes: -1});

    return {
        author: bestBlogger.name,
        likes: bestBlogger.likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}