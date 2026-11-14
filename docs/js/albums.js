const albums = [
    { title: "Go Farther in Lightness", artist: "Gang of Youths", ranking: 1 },
    { title: "Ants From Up There", artist: "Black Country, New Road", ranking: 2 },
    { title: "Titanic Rising", artist: "Weyes Blood", ranking: 3 },
    { title: "Racing Mount Pleasant", artist: "Racing Mount Pleasant", ranking: 4 },
    { title: "3D Country", artist: "Geese", ranking: 5 },
];

const nextAlbums = [
    { title: "Imaginal Disk", artist: "Magdalena Bay", ranking: 6 },
    { title: "Double Infinity", artist: "Big Thief", ranking: 7 },
    { title: "Death in the Business of Whaling", artist: "Searows", ranking: 8 },
    { title: "Blonde", artist: "Frank Ocean", ranking: 9 },
    { title: "Bewitched", artist: "Laufey", ranking: 10 },
];

function normaliseText(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
}

function normaliseTitle(value) {
    const title = String(value || "").replace(
        /\s*(?:[-–—:]\s*)?(?:\(\s*EP\s*\)|\[\s*EP\s*\]|\bEP\b|\bExtended Play\b)\s*$/i,
        ""
    );
    return normaliseText(title);
}

function matchAlbum(result, album) {
    const resultTitle = normaliseTitle(result.collectionName);
    const requestedTitle = normaliseTitle(album.title);
    const requestedArtist = normaliseText(album.artist);

    if (!resultTitle || !requestedTitle || !requestedArtist) {
        return false;
    }

    const titleMatches =
        resultTitle === requestedTitle ||
        resultTitle.includes(requestedTitle) ||
        requestedTitle.includes(resultTitle);

    const artists = [
        result.collectionArtistName,
        result.artistName
    ];

    const artistMatches = artists.some(function (artist) {
        const resultArtist = normaliseText(artist);

        if (!resultArtist) {
            return false;
        }

        return (
            resultArtist === requestedArtist ||
            resultArtist.includes(requestedArtist) ||
            requestedArtist.includes(resultArtist)
        );
    });

    return titleMatches && artistMatches;
}


// Search
async function searchCountry(album, country, entity) {
    const url = new URL("https://itunes.apple.com/search");

    url.search = new URLSearchParams({
        term: album.title,
        media: "music",
        entity: entity,
        attribute: "albumTerm",
        limit: "50",
        country: country
    });

    try {
        const data = await $.getJSON(url.toString());

        return (data.results || []).find(function (result) {
            return matchAlbum(result, album);
        }) || null;

    } catch (error) {
        console.warn(`[Albums] ${country.toUpperCase()} search failed:`, error);
        return null;
    }
}

async function lookupCollection(result, country) {
    if (!result.collectionId) {
        return result;
    }

    const url = new URL("https://itunes.apple.com/lookup");

    url.search = new URLSearchParams({
        id: result.collectionId,
        entity: "song",
        country: country
    });

    try {
        const data = await $.getJSON(url.toString());

        return data.results.find(function (item) {
            return item.wrapperType === "collection";
        }) || result;

    } catch (error) {
        console.warn("[Albums] Collection lookup failed:", error);
        return result;
    }
}

async function searchAlbum(album) {

    // Check AUS
    let match = await searchCountry(album, "au", "album");

    if (match) {
        return match;
    }

    // Search the US and UK
    const countries = ["us", "gb"];

    const internationalAlbums = await Promise.all(
        countries.map(function (country) {
            return searchCountry(album, country, "album");
        })
    );

    match = internationalAlbums.find(Boolean);

    if (match) {
        return match;
    }

    const songCountries = ["au", "us", "gb"];

    const songResults = await Promise.all(
        songCountries.map(function (country) {
            return searchCountry(album, country, "song");
        })
    );

    const songIndex = songResults.findIndex(Boolean);

    if (songIndex === -1) {
        return null;
    }

    return lookupCollection(
        songResults[songIndex],
        songCountries[songIndex]
    );
}

function formatReleaseDate(releaseDate) {

    const releaseYear = String(releaseDate || "").match(/^\d{4}/);

    if (releaseYear) {
        return releaseYear[0];
    }

    return "Year unavailable";
}

function createAlbumElement(album, result) {
    const card = $("<div>", { class: "album" });

    $("<span>", {
        class: "album-ranking",
        text: `#${album.ranking}`
    }).appendTo(card);

    if (result.artworkUrl100) {
        const image = $("<img>", {
            src: result.artworkUrl100.replace(/100x100bb/, "300x300bb"),
            alt: `${album.title} by ${album.artist}`,
            loading: "lazy",
            decoding: "async"
        });

        const storeURL = result.collectionViewUrl || result.trackViewUrl;

        if (storeURL) {
            $("<a>", {
                href: storeURL,
                target: "_blank",
                rel: "noopener noreferrer"
            }).append(image).appendTo(card);
        } else {
            card.append(image);
        }

    } else {
        $("<div>", {
            class: "album-artwork-unavailable",
            text: "Artwork unavailable"
        }).appendTo(card);
    }

    $("<h3>", { text: album.title }).appendTo(card);
    $("<p>", { text: album.artist }).appendTo(card);

    $("<p>", {
        class: "album-release-date",
        text: `${formatReleaseDate(result.releaseDate)}`
    }).appendTo(card);

    return card;
}

function createNextAlbumElement(album) {

    const albumElement = $("<p>", {
        class: "next-album"
    });

    $("<span>", {
        class: "next-album-ranking",
        text: `#${album.ranking}`
    }).appendTo(albumElement);

    $("<span>", {
        class: "next-album-title",
        text: album.title
    }).appendTo(albumElement);

    $("<span>", {
        class: "next-album-artist",
        text: `- ${album.artist}`
    }).appendTo(albumElement);

    return albumElement;
}

function loadNextAlbums() {

    const albumContainer = $("#next-album-list");

    if (!albumContainer.length) {
        console.error('[Albums] Container "#next-album-list" not found.');
        return;
    }

    const sortedAlbums = [...nextAlbums].sort(function (a, b) {
        return a.ranking - b.ranking;
    });

    albumContainer.empty().append(
        sortedAlbums.map(function (album) {
            return createNextAlbumElement(album)[0];
        })
    );
}

function createErrorElement(album) {
    const card = $("<div>", { class: "album album-error" });

    $("<h3>", { text: album.title }).appendTo(card);
    $("<p>", { text: album.artist }).appendTo(card);
    $("<p>", { text: "Artwork unavailable" }).appendTo(card);

    return card;
}

async function loadAlbums() {
    const container = $("#album-list");

    if (!container.length) {
        console.error('[Albums] Container "#album-list" not found.');
        return;
    }

    container.empty();

    const sortedAlbums = [...albums].sort(function (a, b) {
        return a.ranking - b.ranking;
    });

    const cards = await Promise.all(
        sortedAlbums.map(async function (album) {
            try {
                const result = await searchAlbum(album);

                if (result) {
                    console.log(`[Albums] Loaded: ${album.title}`);
                    return createAlbumElement(album, result);
                }

                console.warn(`[Albums] Not found: ${album.title}`);
                return createErrorElement(album);

            } catch (error) {
                console.error(`[Albums] Error loading ${album.title}:`, error);
                return createErrorElement(album);
            }
        })
    );

    container.append(cards.map(function (card) {
        return card[0];
    }));

    console.log("[Albums] Loading completed.");
}

$(function () {
    loadAlbums();
    loadNextAlbums();
});
