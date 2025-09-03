import prisma from "../../config/prisma.js";

// Create a normal post
export const createPost = async (req, res) => {
  try {
    const { content, image_url, college_id } = req.body;
    const userId = req.user.user_id;

    const post = await prisma.post.create({
      data: {
        content,
        image_url,
        type: "POST",
        user_id: userId,
        college_id,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create an event (special type of post)
export const createEvent = async (req, res) => {
  try {
    const { title, description, start_date, end_date, location, college_id } =
      req.body;
    const userId = req.user.user_id;

    const post = await prisma.post.create({
      data: {
        content: description,
        type: "EVENT",
        user_id: userId,
        college_id,
        event: {
          create: {
            title,
            description,
            start_date: new Date(start_date),
            end_date: end_date ? new Date(end_date) : null,
            location,
          },
        },
      },
      include: { event: true },
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch feed for a college
export const getCollegeFeed = async (req, res) => {
  try {
    const { collegeId } = req.params;

    const posts = await prisma.post.findMany({
      where: { college_id: Number(collegeId) },
      include: {
        user: { select: { user_id: true, email: true } },
        comments: { include: { user: true } },
        likes: true,
        event: true,
      },
      orderBy: { created_at: "desc" },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like / Unlike a post
export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.user_id;

    const existing = await prisma.like.findUnique({
      where: { user_id_post_id: { user_id: userId, post_id: Number(postId) } },
    });

    if (existing) {
      await prisma.like.delete({
        where: { like_id: existing.like_id },
      });
      return res.json({ message: "Unliked successfully" });
    } else {
      await prisma.like.create({
        data: { user_id: userId, post_id: Number(postId) },
      });
      return res.json({ message: "Liked successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Comment on a post
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.user_id;

    const comment = await prisma.comment.create({
      data: {
        content,
        user_id: userId,
        post_id: Number(postId),
      },
      include: { user: true },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
