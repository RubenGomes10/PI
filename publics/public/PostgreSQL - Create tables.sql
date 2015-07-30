
  /*
    DROP TABLE followedadvertisement;
    DROP TABLE _comment;
    DROP TABLE advertisement;
    DROP TABLE _user;
  */

CREATE TABLE _user
(
  username text NOT NULL,
  password text NOT NULL,
  email text NOT NULL,
  firstname text NOT NULL,
  lastname text NOT NULL,
  question text NOT NULL,
  response text NOT NULL,
  CONSTRAINT _user_pkey PRIMARY KEY (username),
  CONSTRAINT _user_email_key UNIQUE (email)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE _user
  OWNER TO postgres;


CREATE TABLE advertisement
(
  id serial NOT NULL,
  title character varying(64) NOT NULL,
  description text,
  category text,
  country text,
  city text,
  pictures text DEFAULT "http://static.digit.in/default/thumb_21599_default_td_600.jpeg",
  username text,
  publishdate text NOT NULL DEFAULT ('now'::text)::date,
  publishtime text NOT NULL DEFAULT ('now'::text)::time without time zone,
  CONSTRAINT advertisement_pkey PRIMARY KEY (id),
  CONSTRAINT advertisement_username_fkey FOREIGN KEY (username)
      REFERENCES _user (username) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE advertisement
  OWNER TO postgres;



CREATE TABLE _comment
(
  usernameuser text NOT NULL,
  description text NOT NULL,
  publishdate timestamp without time zone NOT NULL DEFAULT now(),
  advertisementid integer NOT NULL,
  CONSTRAINT _comment_pkey PRIMARY KEY (usernameuser, publishdate, advertisementid),
  CONSTRAINT _comment_advertisementid_fkey FOREIGN KEY (advertisementid)
      REFERENCES advertisement (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT _comment_usernameuser_fkey FOREIGN KEY (usernameuser)
      REFERENCES _user (username) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE _comment
  OWNER TO postgres;




CREATE TABLE followedadvertisement
(
  usernameuser text NOT NULL,
  advertisementid integer NOT NULL,
  changed boolean NOT NULL DEFAULT false,
  CONSTRAINT followedadvertisement_pkey PRIMARY KEY (usernameuser, advertisementid),
  CONSTRAINT followedadvertisement_advertisementid_fkey FOREIGN KEY (advertisementid)
      REFERENCES advertisement (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT followedadvertisement_usernameuser_fkey FOREIGN KEY (usernameuser)
      REFERENCES _user (username) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE followedadvertisement
  OWNER TO postgres;
