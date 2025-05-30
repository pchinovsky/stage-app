import { Select, SelectItem } from "@heroui/react";

export function ArtistInput({ artistList, selectedArtists, onChange, error }) {
    const handleSelect = (keys) => {
        const selectedId = Array.from(keys)[0];

        const selectedArtist = artistList.find(
            (artist) => artist.id === selectedId
        );

        if (
            !selectedArtist ||
            selectedArtists.some((a) => a.id === selectedArtist.id)
        )
            return;

        onChange([...selectedArtists, selectedArtist]);
    };

    return (
        <Select
            label="Add Artists"
            placeholder="Select artists"
            onSelectionChange={handleSelect}
            className="md:col-span-2"
            isInvalid={!!error?.artists}
            errorMessage={error?.artists?.[0]}
            isRequired
        >
            {artistList.map((artist) => (
                <SelectItem key={artist.id} value={artist.id}>
                    {artist.name}
                </SelectItem>
            ))}
        </Select>
    );
}
