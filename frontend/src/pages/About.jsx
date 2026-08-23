import React from "react";
import { FiTruck, FiShield, FiAward, FiUsers } from "react-icons/fi";

const values = [
  { icon: FiAward, title: "Genuine Craftsmanship", desc: "Every pair is handmade using authentic leather and traditional Peshawari techniques." },
  { icon: FiUsers, title: "Skilled Artisans", desc: "Our craftsmen bring generations of expertise to every stitch." },
  { icon: FiShield, title: "Quality You Can Trust", desc: "We stand behind the durability and comfort of every chappal we sell." },
  { icon: FiTruck, title: "Delivered Across Pakistan", desc: "Reliable nationwide delivery, with Cash on Delivery available." },
];

const About = () => (
  <div>
    <section className="border-b border-line bg-primary-light/40 py-14">
      <div className="container-app text-center">
        <h1 className="section-title">About MS Footwear</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          MS Footwear was founded with a simple mission: to bring authentic, handcrafted Peshawari
          Chappal to customers across Pakistan, combining traditional craftsmanship with modern
          comfort and style.
        </p>
      </div>
    </section>

    <section className="container-app py-14">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card p-6 text-center">
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
              <Icon size={22} />
            </span>
            <h3 className="mb-2 text-sm font-semibold text-ink">{title}</h3>
            <p className="text-xs text-muted">{desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="border-t border-line bg-primary-light/30 py-14">
      <div className="container-app grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="aspect-video overflow-hidden rounded-xl border border-line bg-white">
          <img src="https://images.openai.com/static-rsc-4/WH_LYsSizfkjt_IemOCjRe4KuPuxF3ihkBiAYrpusB6h_rqW9DvrO03SSEQKDgGKG0TKO6chs0ygyAmPWKb7GdMZ68pfGkpSL8mKIkHK9_qM2mvh3Y_6n6AJ6cKQZGhYzlxwLTs9A8RKlUyd78xme1jnInNAAwBRDF1mq8nuvdjdOZUYUtQ1nc0gpo0vIygy?purpose=fullsize" alt="Peshawari Chappal craftsmanship" className="h-full w-full object-cover" />
        </div>
        <div>
          <h2 className="section-title">Our Story</h2>
          <p className="mt-4 text-muted">
            Peshawari Chappal is more than footwear — it's a symbol of heritage. At MS Footwear, we
            work closely with local artisans to preserve this craft while making it accessible to
            customers everywhere, without ever compromising on quality or comfort.
          </p>
        </div>
      </div>
    </section>
  </div>
);

export default About;
