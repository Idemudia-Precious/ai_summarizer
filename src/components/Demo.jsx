import React, { useState, useEffect } from "react";

import { copyicon, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

import copy from "copy-to-clipboard";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
    length: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  //copy the summary
  const [copiedSum, setCopiedSum] = useState("");

  // RTK lazy query
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  // Load data from localStorage on mount
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) return setArticle(existingArticle);

    const { data } = await getSummary({
      articleUrl: article.url,
      articleLength: article.length,
    });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      // update state and local storage
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  // copy the url and toggle the icon for user feedback
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      {/* Search */}
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex-col space-y-3 flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <div className="relative w-full flex justify-center items-center">
            <img
              src={linkIcon}
              alt="link-icon"
              className="absolute left-0 my-2 ml-3 w-5"
            />

            <input
              type="url"
              placeholder="Paste the article link"
              value={article.url}
              onChange={(e) => setArticle({ ...article, url: e.target.value })}
              onKeyDown={handleKeyDown}
              required
              className="url_input peer" // When you need to style an element based on the state of a sibling element, mark the sibling with the peer class, and use peer-* modifiers to style the target element
            />
          </div>
          <div className="relative w-full flex justify-center items-center">
            <img
              src={linkIcon}
              alt="link-icon"
              className="absolute left-0 my-2 ml-3 w-5"
            />

            <select
              className="url_input"
              value={article.length}
              onChange={(e) =>
                setArticle({ ...article, length: e.target.value })
              }
              required
            >
              <option>How long would you like the summary to be?</option>
              <option value="1">Short</option>
              <option value="2">Moderate</option>
              <option value="3">Long</option>
              <option value="4">Very Long</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full orange_gradient2 submit_btn2 "
          >
            Summarize
          </button>
        </form>

        {/* Browse History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.reverse().map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copyicon}
                  alt={copied === item.url ? "tick_icon" : "copy_icon"}
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Display Result */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn't supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box flex flex-col">
                <div className="flex justify-end">
                  <div className="flex flex-row">
                    <div
                      className={`${
                        copiedSum === article.summary ? "block" : "hidden"
                      }`}
                    >
                      <p className="text-sm">copied!</p>
                    </div>
                    <div className="copy_btn">
                      <img
                        onClick={() => {
                          copy(article.summary);
                          setCopiedSum(article.summary);
                          setTimeout(() => setCopiedSum(false), 3000);
                        }}
                        src={copiedSum === article.summary ? tick : copyicon}
                        alt={"copy_icon"}
                        className="w-[40%] h-[40%] object-contain"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-inter font-medium text-sm text-gray-700">
                    {article.summary}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
