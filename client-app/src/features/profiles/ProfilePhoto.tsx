import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import { Button, Card, Grid, Header, Image, Tab } from "semantic-ui-react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";


interface Props {
    profile: Profile;
}
export default observer(function ProfilePhoto({ profile }: Props) {
    const { profileStore: { isCurrentUser, uploadPhoto, uploading, loading, setMainPhoto, deletePhoto, deleting } } = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);

    const [target, setTarget] = useState('');

    function handleUploadPhoto(file: Blob) {
        uploadPhoto(file).then(() => setAddPhotoMode(false)
        )
    }

    function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    function handleDeletePhoto(id: string, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        deletePhoto(id);
    }
    return (
        <Tab.Pane loading={loading}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='image' content='Photos'></Header>
                    {isCurrentUser && (
                        <Button floated='right' basic content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}></Button>
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handleUploadPhoto} loading={uploading} />
                    ) : <Card.Group itemsPerRow={5}>
                        {profile.photos?.map(photo => <Card key={photo.id}>
                            <Image src={photo.url || '/assets/user.png'}></Image>
                            {isCurrentUser && (
                                <Button.Group>
                                    <Button basic color='green'
                                        content={photo.isMain ? 'Already main' : 'Main'}
                                        name={photo.id}
                                        disabled={photo.isMain}
                                        loading={target === photo.id && loading}
                                        onClick={e => handleSetMainPhoto(photo, e)} />
                                    {!photo.isMain &&
                                        <Button loading={target === photo.id && deleting} name={photo.id} color='red' icon='trash' onClick={e => handleDeletePhoto(photo.id, e)} />}
                                </Button.Group>
                            )}
                        </Card>)}
                    </Card.Group>}
                </Grid.Column>
            </Grid>
        </Tab.Pane >
    )
})