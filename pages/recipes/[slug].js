import { useState } from "react";
import {
  sanityClient,
  urlFor,
  usePreviewSubscription,
  PortableText,
} from "../../lib/sanity";

const recipeQuery = `*[_type == "recipe" && slug.current == $slug][0]{
      _id,
      name,
      slug,
      mainImage,
      ingredient[]{
        _key,
        unit,
        wholeNumber,
        fraction,
        ingredient->{
          name
        }
      },
      instructions,
      likes
    }`;

export default function OneRecipe({ data }) {
  const [likes, setLikes] = useState(data?.recipe?.likes);
  const { recipe } = data;
  console.log(recipe);

  const addLike = async() => {
    const res = await fetch('/api/handle-like', {
      method: 'POST',
      body: JSON.stringify({ _id: recipe._id }),
    }).catch((error) => console.log(error))

    const data = await res.json();

    setLikes(data.likes);
  }

  return (
    <article className="recipe">
      <h1>{recipe.name}</h1>

      <button className="like-button" onClick={addLike}>
        {likes} ❤️
      </button>

      <main className="content">
        <img src={urlFor(recipe?.mainImage).url()} alt={recipe.name} />
        <div className="breakdown">
          <ul className="ingredients">
            {recipe.ingredient?.map((ingredient) => {
              console.log(ingredient);
              return (
                <li className="ingredient" key={ingredient._key}>
                  {ingredient?.wholeNumber}
                  {ingredient?.fraction}
                  {" "}
                  {ingredient?.unit}
                  <br />
                  {ingredient?.ingredient?.name}
                </li>
              )
            })}
          </ul>
          <PortableText blocks={recipe?.instructions} className="instructions" />
        </div>
      </main>
    </article>
  )
}

// Gets all of the paths for the dynamic route
export async function getStaticPaths() {
  const paths = await sanityClient.fetch(
    `*[_type == "recipe" && defined(slug.current)]{
      "params": {
        "slug": slug.current
      }
    }`
  );

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const recipe = await sanityClient.fetch(recipeQuery, { slug });
  return { props: { data: { recipe } } };
}