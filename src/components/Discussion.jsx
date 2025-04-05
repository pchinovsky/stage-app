import React from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { Button, Form, Input, Spinner } from "@heroui/react";
import useComments from "../hooks/useComments";
import CommentList from "./CommentList";

const Discussion = React.memo(function Discussion({ eventId, authorData }) {
    const { isAuth } = useContext(AuthContext);
    const { comments, loading, form, handleRemoveComment } = useComments(
        eventId,
        authorData
    );

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (form.formValues.content.trim() !== "") {
            await form.handleSubmit(e);
            form.setFormValues((prev) => ({
                ...prev,
                content: "",
            }));
        }
    };

    return (
        <div className="absolute font-primary left-[0px] top-[0px] w-[955px] h-[335px] border border-white p-4 rounded-lg z-[100] bg-transparent hover:bg-white transition-all ease-in-out duration-1000">
            {loading ? (
                <div className="flex justify-center items-center h-[250px] ml-auto">
                    <Spinner size="lg" />
                </div>
            ) : (
                <CommentList
                    comments={comments}
                    handleRemoveComment={handleRemoveComment}
                />
            )}

            {isAuth && (
                <Form
                    onSubmit={handleAddComment}
                    className="flex mt-3 gap-2 w-full"
                >
                    <div className="flex gap-2 w-full">
                        <Input
                            type="text"
                            name="content"
                            radius="sm"
                            className="flex-1"
                            placeholder="Write a comment..."
                            value={form.formValues.content}
                            onChange={form.handleInputChange}
                        />
                        <Button
                            type="submit"
                            color="primary"
                            className="self-end"
                            radius="sm"
                        >
                            Submit
                        </Button>
                    </div>
                </Form>
            )}
        </div>
    );
});

export default Discussion;
