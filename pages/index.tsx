import { SyntheticEvent, useState } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import Modal from "react-modal";
import { Restaurant } from "types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "90%",
    height: "80%",
    transform: "translate(-50%, -50%)",
    borderRadius: "5px",
  },
};
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [query, setQuery] = useState("");
  const [userInterests, setUserInterests] = useState("");
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<
    Restaurant | undefined
  >(undefined);

  const openModal = (restaurant_name: string) => {
    const restaurantSelection = recommendedRestaurants.filter(
      (restaurant: Restaurant) => {
        return restaurant.name === restaurant_name;
      }
    );
    console.log(restaurantSelection);
    setSelectedRestaurant(restaurantSelection[0]);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const getRecommendations = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Check Inputs
    if (query === "") {
      alert("Please let us know what type of food you're looking for!");
      return;
    }

    setIsLoading(true);

    await fetch("/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        userInterests,
      }),
    })
      .then((res) => {
        console.log(res);
        if (res.ok) return res.json();
      })
      .then((recommendations) => {
        console.log(recommendations.data.Get.Restaurant);
        setRecommendedRestaurants(recommendations.data.Get.Restaurant);
      });

    setIsLoading(false);
    setLoadedOnce(true);
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-gray-100">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="flex justify-between">
          <h3 className="mt-2 text-lg font-semibold text-gray-700">
            {selectedRestaurant?.name}
          </h3>
          <Button
            className="hover:font-bold rounded hover:bg-gray-700 p-2 w-20 hover:text-white "
            onClick={closeModal}
          >
            Close
          </Button>
        </div>
        <div>
          <div className="flex justify-center py-10">
            <div className="w-48 h-72 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🍽️</div>
                <div>Restaurant Image</div>
              </div>
            </div>
          </div>
          <div>
            <p className="mt-1 text-gray-500">
              <span className="font-bold">Location</span>:{" "}
              {selectedRestaurant?.vicinity}
            </p>
            <p>
              <span className="font-bold">Category</span>:{" "}
              {selectedRestaurant?.category}
            </p>
            <p>
              <span className="font-bold">Rating</span>:{" "}
              {selectedRestaurant?.rating}
            </p>
            <p>
              <span className="font-bold">Price Level</span>:{" "}
              {selectedRestaurant?.price_level}
            </p>
            <p>
              <span className="font-bold">Opening Hours</span>:{" "}
              {selectedRestaurant?.opening_hours}
            </p>
            <br />
            <p>{selectedRestaurant?.generated_review}</p>

            <div className="flex justify-center">
              <a
                className="hover:animate-pulse"
                target="_blank"
                href={
                  "https://www.google.com/maps/place/" +
                  selectedRestaurant?.formatted_address
                }
              >
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  View on Google Maps
                </button>
              </a>
            </div>
          </div>
        </div>
      </Modal>
      <div className="mb-auto py-10 px-4 bg-gray-100">
        <div className="container mx-auto">
          <h1 className="text-3xl font-black mb-6 text-center">
            Restaurant Recommendations
          </h1>

          <form
            id="recommendation-form"
            className="mb-10"
            onSubmit={getRecommendations}
          >
            <div className="mb-4">
              <label
                htmlFor="favorite-books"
                className="block text-gray-700 font-bold mb-2"
              >
                What type of food are you looking for?
              </label>
              <Input
                type="text"
                id="favorite-books"
                name="favorite-books"
                placeholder="I'm craving..."
                className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm "
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
              {process.env.NEXT_PUBLIC_COHERE_CONFIGURED && (
                <>
                  <label
                    htmlFor="interests-input"
                    className="block text-gray-700 font-bold mb-2 pt-4"
                  >
                    Your dining preferences
                  </label>
                  <Input
                    type="text"
                    id="interests-input"
                    name="interests"
                    placeholder="Tell us about your dining preferences, occasion, etc..."
                    className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm "
                    value={userInterests}
                    onChange={(e) => {
                      setUserInterests(e.target.value);
                    }}
                  />
                </>
              )}
            </div>
            <Button
              className="bg-black text-white w-full rounded-md hover:bg-gray-800 hover:text-white"
              disabled={isLoading}
              type="submit"
              variant="outline"
            >
              Get Recommendations
            </Button>
          </form>

          {isLoading ? (
            <div className="w-full flex justify-center h-60 pt-10">
              <CircleLoader
                color={"#000000"}
                loading={isLoading}
                size={100}
                aria-label="Loading"
                data-testid="loader"
              />
            </div>
          ) : (
            <>
              {loadedOnce ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    Recommended Restaurants
                  </h2>
                  <div
                    id="recommended-books"
                    className="flex overflow-x-scroll pb-10 hide-scroll-bar"
                  >
                    {/* <!-- Recommended books dynamically added here --> */}
                    <section className="container mx-auto mb-12">
                      <div className="flex flex-wrap -mx-2">
                        {recommendedRestaurants.map(
                          (restaurant: Restaurant) => {
                            return (
                              <div
                                key={restaurant.place_id || restaurant.name}
                                className="w-full md:w-1/3 px-2 mb-4 animate-pop-in"
                              >
                                <div className="bg-white p-6 flex items-center flex-col">
                                  <div className="flex justify-between w-full">
                                    <h3 className="text-xl font-semibold mb-4 line-clamp-1">
                                      {restaurant.name}
                                    </h3>
                                    {process.env
                                      .NEXT_PUBLIC_COHERE_CONFIGURED &&
                                      restaurant._additional?.generate?.error !=
                                        "connection to Cohere API failed with status: 429" && (
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button className="rounded-full p-2 bg-black cursor-pointer w-10 h-10">
                                              ✨
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-80 h-80 overflow-auto">
                                            <div>
                                              <p className="text-2xl font-bold">
                                                Why you&apos;ll like this
                                                restaurant:
                                              </p>
                                              <br />
                                              <p>
                                                {
                                                  restaurant._additional
                                                    ?.generate?.singleResult
                                                }
                                              </p>
                                            </div>
                                          </PopoverContent>
                                        </Popover>
                                      )}
                                  </div>
                                  <div className="w-48 h-72 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                      <div className="text-4xl mb-2">🍽️</div>
                                      <div>{restaurant.category}</div>
                                    </div>
                                  </div>
                                  <p className="mt-4 text-gray-500 line-clamp-1">
                                    {restaurant.vicinity}
                                  </p>
                                  <p className="text-yellow-500">
                                    ⭐ {restaurant.rating}
                                  </p>
                                  <div className="flex">
                                    <Button
                                      className="bg-black text-white w-full rounded-md hover:bg-gray-800 hover:text-white"
                                      type="submit"
                                      variant="outline"
                                      onClick={() => {
                                        openModal(restaurant.name);
                                      }}
                                    >
                                      Learn More
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </section>
                  </div>
                </>
              ) : (
                <div className="w-full flex justify-center h-60 pt-10"></div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
