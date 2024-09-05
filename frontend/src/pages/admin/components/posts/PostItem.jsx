import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import PopUp from "../../../../components/popup";
import Tooltip from "../../../../components/tooltip";
import { usePopUp } from "../../../../components/popup/usePopUp";
import Button from "../../../../components/button";

const PostItem = ({ post, handleDeleteConfirm }) => {
    const popUpDelete = usePopUp();
    const truncatedContent =
        post.content.length > 200
            ? post.content.substring(0, 200) + "..."
            : post.content;

    const handleButtonClick = () => {
    };


    const onDeleteConfirm = async () => {
        popUpDelete.onClose();
        handleDeleteConfirm(post._id);
    };

    return (
        <div
            className="bg-black border rounded-lg shadow mb-3 p-4"
        >
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        to={`/post/${post._id}`}
                        className="no-underline"
                    >
                        {/* <h5 className="text-lg font-bold text-gray-800 hover:text-primary cursor-pointer">{post.title || "No title"}</h5> */}
                        <div
                            dangerouslySetInnerHTML={{ __html: truncatedContent }}
                            className="text-lg font-bold text-gray-800 hover:text-primary cursor-pointer"
                        ></div>
                    </Link>
                    <div className="flex flex-col md:flex-row items-start md:items-center mb-2">
                        <div>
                            <p
                                className="text-sm text-gray-600 mb-0"
                            >
                                <strong>Author: {post.author.email || "User"}{" "}</strong>
                            </p>
                            <p
                                className="text-sm text-gray-600 mb-0"
                            >
                                <small>Group: {post.groupId?.groupName || "" }</small>
                            </p>
                            <p
                                className="text-sm text-gray-600 mb-0"
                            >
                                <small>Posted: {post.createdAt}</small>
                            </p>
                        </div>
                        {/* <div className="ml-3">
                            <PostStatusBox status={post.status} />
                        </div> */}
                    </div>
                </div>
                <div>
                    <Tooltip text="Delete post" position={"top"}>
                        <Button variant="outline-primary" size='sm' onClick={() => popUpDelete.setTrue()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </Button>
                    </Tooltip>

                    <PopUp
                        {...popUpDelete}
                        onConfirm={onDeleteConfirm}
                        title="Delete post Confirmation"
                        desc={`Are you sure you want to delete this post?`}
                    />
                </div>
            </div>
            <hr className="my-3" />

        </div>
    );
};

PostItem.propTypes = {
    post: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string,
        content: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        authorId: PropTypes.shape({
            username: PropTypes.string,
        }),
        status: PropTypes.string.isRequired,
        deletedAt: PropTypes.string,
    }).isRequired,
    handleLockConfirm: PropTypes.func.isRequired,
    handleUnLockConfirm: PropTypes.func.isRequired,
};

export default PostItem;
