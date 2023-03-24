class MarvelService {
  #apiBase = 'https://gateway.marvel.com:443/v1/public/';
  #apiKey = 'd371ed7ea24992441e33620ff22a8cf2';
  #defaultOffset = 210;

  getResource = async (url) => {
    let response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, status: ${response.status}`);
    }

    return await response.json();
  };

  getAllCharacters = async (offset = this.#defaultOffset) => {
    const response = await this.getResource(
      `${this.#apiBase}characters?limit=9&offset=${offset}&apikey=${
        this.#apiKey
      }`
    );
    return response.data.results.map((char) => this.#transformCharacter(char));
  };

  getCharacter = async (id) => {
    const response = await this.getResource(
      `${this.#apiBase}characters/${id}?apikey=${this.#apiKey}`
    );
    return this.#transformCharacter(response.data.results[0]);
  };

  #transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 210)}...`
        : `There is no description for this character...`,
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };
}

export default MarvelService;
