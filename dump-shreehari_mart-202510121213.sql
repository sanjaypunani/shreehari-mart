--
-- PostgreSQL database cluster dump
--

-- Started on 2025-10-12 12:13:32 IST

\restrict c3i4Pdwysbt5GJBFo63m51Bybl43BtLWUkEHnpIZ1WeImCRE4jXq87IhHzKGzuO

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

-- CREATE ROLE postgres;
-- ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;

--
-- User Configurations
--








\unrestrict c3i4Pdwysbt5GJBFo63m51Bybl43BtLWUkEHnpIZ1WeImCRE4jXq87IhHzKGzuO

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict KTjZqK1fhrMACBZA70a0dxBXAYGsA6xegGJejEpPQVlbAdiSVhX8wgpLMzHHeSH

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 17.6

-- Started on 2025-10-12 12:13:32 IST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Completed on 2025-10-12 12:13:32 IST

--
-- PostgreSQL database dump complete
--

\unrestrict KTjZqK1fhrMACBZA70a0dxBXAYGsA6xegGJejEpPQVlbAdiSVhX8wgpLMzHHeSH

--
-- Database "shreehari_mart" dump
--

--
-- PostgreSQL database dump
--

\restrict V9Kghr8HTuOa6hgpD8eqcsmW6zxYyr62fTAIZnHkLVyBvwrajOvJdsfha6CgOmF

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 17.6

-- Started on 2025-10-12 12:13:32 IST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3519 (class 1262 OID 41314)
-- Name: shreehari_mart; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE shreehari_mart WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE shreehari_mart OWNER TO postgres;

\unrestrict V9Kghr8HTuOa6hgpD8eqcsmW6zxYyr62fTAIZnHkLVyBvwrajOvJdsfha6CgOmF
\connect shreehari_mart
\restrict V9Kghr8HTuOa6hgpD8eqcsmW6zxYyr62fTAIZnHkLVyBvwrajOvJdsfha6CgOmF

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 41315)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 899 (class 1247 OID 65917)
-- Name: monthly_bills_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.monthly_bills_status_enum AS ENUM (
    'draft',
    'sent',
    'paid',
    'overdue'
);


ALTER TYPE public.monthly_bills_status_enum OWNER TO postgres;

--
-- TOC entry 890 (class 1247 OID 41637)
-- Name: order_items_unit_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_items_unit_enum AS ENUM (
    'gm',
    'kg',
    'pc'
);


ALTER TYPE public.order_items_unit_enum OWNER TO postgres;

--
-- TOC entry 896 (class 1247 OID 41664)
-- Name: orders_paymentmode_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.orders_paymentmode_enum AS ENUM (
    'wallet',
    'monthly',
    'cod'
);


ALTER TYPE public.orders_paymentmode_enum OWNER TO postgres;

--
-- TOC entry 893 (class 1247 OID 41644)
-- Name: orders_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.orders_status_enum AS ENUM (
    'pending',
    'confirmed',
    'delivered',
    'cancelled'
);


ALTER TYPE public.orders_status_enum OWNER TO postgres;

--
-- TOC entry 872 (class 1247 OID 41434)
-- Name: products_unit_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.products_unit_enum AS ENUM (
    'gm',
    'kg',
    'pc'
);


ALTER TYPE public.products_unit_enum OWNER TO postgres;

--
-- TOC entry 881 (class 1247 OID 41564)
-- Name: wallet_transactions_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.wallet_transactions_type_enum AS ENUM (
    'credit',
    'debit'
);


ALTER TYPE public.wallet_transactions_type_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 41326)
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    street character varying(500) NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    "zipCode" character varying(20) NOT NULL,
    country character varying(100) DEFAULT 'India'::character varying NOT NULL
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 41543)
-- Name: buildings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buildings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "societyId" uuid NOT NULL,
    name character varying(10) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.buildings OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 41335)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "addressId" uuid,
    "societyId" uuid NOT NULL,
    "buildingId" uuid NOT NULL,
    "mobileNumber" character varying(15) NOT NULL,
    "flatNumber" character varying(50) NOT NULL,
    "isMonthlyPayment" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 65925)
-- Name: monthly_bills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.monthly_bills (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "customerId" uuid NOT NULL,
    "billNumber" character varying(50) NOT NULL,
    "billingMonth" character varying(7) NOT NULL,
    "billingYear" integer NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    "orderCount" integer DEFAULT 0 NOT NULL,
    status public.monthly_bills_status_enum DEFAULT 'draft'::public.monthly_bills_status_enum NOT NULL,
    "dueDate" timestamp without time zone,
    "sentAt" timestamp without time zone,
    "paidAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.monthly_bills OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 41376)
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "orderId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    "orderedQuantity" integer NOT NULL,
    "pricePerBaseUnit" numeric(10,2) NOT NULL,
    "baseQuantity" integer NOT NULL,
    "finalPrice" numeric(10,2) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    unit public.order_items_unit_enum NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 41363)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "customerId" uuid NOT NULL,
    status public.orders_status_enum DEFAULT 'pending'::public.orders_status_enum NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    notes text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "paymentMode" public.orders_paymentmode_enum DEFAULT 'cod'::public.orders_paymentmode_enum NOT NULL,
    "deliveryDate" date,
    discount numeric(10,2) DEFAULT '0'::numeric,
    "monthlyBillId" uuid
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 41382)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    "imageUrl" character varying(500),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    price numeric(10,2) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit public.products_unit_enum DEFAULT 'kg'::public.products_unit_enum NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 41552)
-- Name: societies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.societies (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    address text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.societies OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 41569)
-- Name: wallet_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wallet_transactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "walletId" uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    type public.wallet_transactions_type_enum NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.wallet_transactions OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 41581)
-- Name: wallets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wallets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "customerId" uuid NOT NULL,
    balance numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.wallets OWNER TO postgres;

--
-- TOC entry 3504 (class 0 OID 41326)
-- Dependencies: 215
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.addresses (id, street, city, state, "zipCode", country) FROM stdin;
6f8866d1-8bc0-4617-b2a7-62076abe2f92	Binori B Square 1, 801, 8th floor	Ahmedabad	Gujarat	380058	Italy
\.


--
-- TOC entry 3509 (class 0 OID 41543)
-- Dependencies: 220
-- Data for Name: buildings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.buildings (id, "societyId", name, "createdAt", "updatedAt") FROM stdin;
e1fb1cf1-1090-454f-aad8-48ef79b6565d	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	A	2025-09-13 10:40:24.328977	2025-09-13 10:40:24.328977
3b693c2e-2c1f-4bc8-8a69-f961e6359a26	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	B	2025-09-19 15:24:37.819974	2025-09-19 15:24:37.819974
bb92610d-dc2d-4dbe-87c7-74c45b2303e4	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	C	2025-09-19 15:24:44.043334	2025-09-19 15:24:44.043334
1c30e824-4f70-41a0-a0f2-36a0daf6f9d1	6e5d02a6-8a98-4f4a-beb2-6610757a9fed	A	2025-09-19 15:25:12.00864	2025-09-19 15:25:12.00864
f34821bb-adcf-4a79-b78a-6c314fd98b1c	6e5d02a6-8a98-4f4a-beb2-6610757a9fed	B	2025-09-19 15:25:17.262353	2025-09-19 15:25:17.262353
52b09c43-ee50-4e6c-9e2e-bda1fc5366e8	6e5d02a6-8a98-4f4a-beb2-6610757a9fed	C	2025-09-19 15:25:23.864555	2025-09-19 15:25:23.864555
5c161657-72da-4576-b2b3-327760c9c4f9	126c6d3b-18ee-47f9-8735-1ea53de8ab24	B	2025-09-19 15:53:25.527533	2025-09-19 15:53:25.527533
31bee844-5496-4f82-9b91-8d8a0a87e8d6	f2a28bff-0ea9-404f-aa7e-3dc990df35de	A	2025-09-19 15:53:25.540696	2025-09-19 15:53:25.540696
e06b8923-451f-41f1-a32f-4c75446ba014	9bd0f48a-c6a7-4a59-830b-6b9260ba7bc1	A	2025-09-19 15:53:25.551719	2025-09-19 15:53:25.551719
a593d83f-1a8c-4d34-acc0-0254fb525665	126c6d3b-18ee-47f9-8735-1ea53de8ab24	A	2025-09-19 15:53:25.606257	2025-09-19 15:53:25.606257
9c84a0c7-7698-4fc6-b74f-b8c189ab5b54	92554ea2-b228-452f-a554-a98523f7730f	C	2025-10-07 15:32:43.025902	2025-10-07 15:32:43.025902
\.


--
-- TOC entry 3505 (class 0 OID 41335)
-- Dependencies: 216
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, name, email, phone, "createdAt", "updatedAt", "addressId", "societyId", "buildingId", "mobileNumber", "flatNumber", "isMonthlyPayment") FROM stdin;
bab4eb84-5c93-41c2-ba24-9de74fa5bfeb	Unnamed Customer	unnamed.customer.8238067013@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:44.429	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	8238067013	A703	f
1288b864-f877-43de-bb38-a9fdf25139ba	Unnamed Customer	unnamed.customer.9104316034@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.249	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	9104316034	A603	f
508d35ee-9499-4a36-a86e-87aea14a19ee	Unnamed Customer	unnamed.customer.8698534813@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.77	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	8698534813	A604	f
30a179a7-bafe-4412-8383-0e194cfb6b6a	Unnamed Customer	unnamed.customer.9913753770@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.121	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	9913753770	C1104	f
b6ed41d6-3855-4be9-8556-509649f98ea3	Unnamed Customer	unnamed.customer.9624910118@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.336	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	9624910118	C503	f
9051cac2-d198-410c-9e1a-12ddc09a0281	Unnamed Customer	unnamed.customer.9739057990@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:44.558	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	9739057990	C202	f
df7645e2-ac6a-46fa-9244-164e79475367	Unnamed Customer	unnamed.customer.9924363618@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:44.602	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	3b693c2e-2c1f-4bc8-8a69-f961e6359a26	9924363618	B1102	f
b10d3155-4939-4d12-b63b-e6c7f099b2c8	Unnamed Customer	unnamed.customer.9904381025@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.729	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	9904381025	A704	f
e3ed9081-7304-47e4-a96f-1269fc73810e	Unnamed Customer	unnamed.customer.9913422877@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-09-17 20:43:58.583	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	3b693c2e-2c1f-4bc8-8a69-f961e6359a26	9913422877	B802	f
9296d5c2-7f35-4294-bdb1-508ac8610567	Unnamed Customer	unnamed.customer.7226924618@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.165	\N	126c6d3b-18ee-47f9-8735-1ea53de8ab24	5c161657-72da-4576-b2b3-327760c9c4f9	7226924618	B601	f
b1ff0014-3714-4fb6-a6f2-e8d421667b93	Unnamed Customer	unnamed.customer.7573008141@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:44.47	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	7573008141	C502	f
d14804c1-315d-437a-9ae6-69f663268eef	Unnamed Customer	unnamed.customer.9727645583@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:44.301	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	9727645583	A202	f
91071c17-4d9a-4ba3-9696-b1ed80e85093	Unnamed Customer	unnamed.customer.8264045155@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.812	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	8264045155	C1002	f
d4c3d6e2-c77a-4587-8008-3ba718606f6e	Unnamed Customer	unnamed.customer.9925720858@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:44.345	\N	f2a28bff-0ea9-404f-aa7e-3dc990df35de	31bee844-5496-4f82-9b91-8d8a0a87e8d6	9925720858	Reference from paras	f
852b04f2-6161-4bc8-9c0e-25dfb21843ee	Unnamed Customer	unnamed.customer.9427772493@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.689	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	9427772493	A902	f
575d4c3b-9545-4844-bee8-72f143e06588	Unnamed Customer	unnamed.customer.9408751110@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.211	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	9408751110	A1102	f
ead2fb47-aa53-4a26-b71b-7ddcdd78a5fa	Unnamed Customer	unnamed.customer.7046444888@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:44.081	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	7046444888	A301	f
7ff6ecf3-3c66-4b1b-a46d-751f1bf1ca03	Unnamed Customer	unnamed.customer.9586573668@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-25 19:34:33.479	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	9586573668	A1004	f
3a05a7b5-8b15-4587-8c82-2f8c949b9f50	Unnamed Customer	unnamed.customer.9978543506@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:42.985	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	3b693c2e-2c1f-4bc8-8a69-f961e6359a26	9978543506	B1104	f
08a309b7-6644-4e01-90fe-3fcd83586473	Unnamed Customer	unnamed.customer.8141546229@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-25 18:59:39.428	\N	9bd0f48a-c6a7-4a59-830b-6b9260ba7bc1	e06b8923-451f-41f1-a32f-4c75446ba014	8141546229	A904	f
482464d2-3ff6-4d81-ac05-495e9512d0b1	Unnamed Customer	unnamed.customer.9601166757@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.035	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	3b693c2e-2c1f-4bc8-8a69-f961e6359a26	9601166757	B103	f
73a77b18-546f-4295-b1ce-7ca9398f895d	Unnamed Customer	unnamed.customer.9428614648@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.076	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	9428614648	A101	f
bbf2b0ae-1138-4c82-a9e8-5de175783faf	Unnamed Customer	unnamed.customer.8733085578@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.901	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	8733085578	A403	f
42db859d-2b6d-413a-995c-ecfcc592efec	Unnamed Customer	unnamed.customer.8780885011@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.949	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	8780885011	C1001	f
0dfba9c7-26be-434a-8730-81bbba44d911	Unnamed Customer	unnamed.customer.7016268762@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:44.131	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	3b693c2e-2c1f-4bc8-8a69-f961e6359a26	7016268762	B902	f
78b4661c-3ce5-4159-8aa1-ea92b52f72d0	Unnamed Customer	unnamed.customer.9978994548@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:44.513	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	9978994548	C602	f
785142de-c2aa-43bb-ab19-851d6fdbf58a	Unnamed Customer	unnamed.customer.9081290019@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.293	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	3b693c2e-2c1f-4bc8-8a69-f961e6359a26	9081290019	B1304	f
f9e98b36-4c63-4f48-8842-f2650e599429	Unnamed Customer	unnamed.customer.9913770821@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-09-14 14:38:19.674	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	9913770821	A402	f
45a7f3ee-7708-4f9c-8614-abd65f86fd2f	Unnamed Customer	unnamed.customer.8866343500@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.994	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	8866343500	C903	f
2ab70cad-148a-4518-907e-816134b23206	Unnamed Customer	unnamed.customer.9712154568@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:44.26	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	9712154568	A401	f
4c20c147-b762-4842-a089-8cc3aed679eb	Unnamed Customer	unnamed.customer.7405056196@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:44.218	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	7405056196	C1101	f
77688538-8035-4580-8ec1-c565caa1ef17	Unnamed Customer	unnamed.customer.9558618244@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.51	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	9558618244	A701	f
59fb23ae-d1db-4848-81c3-dd81c18b9c03	Unnamed Customer	unnamed.customer.9428439541@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.425	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	9428439541	C601	f
31c134a9-aa1c-4841-bab3-dc6b4f839b85	Unnamed Customer	unnamed.customer.8758644191@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-09-20 06:17:17.513636	\N	6e5d02a6-8a98-4f4a-beb2-6610757a9fed	52b09c43-ee50-4e6c-9e2e-bda1fc5366e8	8758644191	C702	f
b3833c23-20c7-4f01-86b6-cfbe076177c8	Unnamed Customer	unnamed.customer.8866826878@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-09-20 06:17:39.842427	\N	6e5d02a6-8a98-4f4a-beb2-6610757a9fed	52b09c43-ee50-4e6c-9e2e-bda1fc5366e8	8866826878	C704	f
999fa389-feac-40b5-98e4-035c019ba582	Test Customer	test@example.com	\N	2025-09-13 10:57:30.341943	2025-09-21 10:01:49.383018	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	+1234567890	A101	t
fc232533-fa96-4b55-a790-b6ffd0078d84	Sanjay Punani	sanjayp@itpathsolutions.com	\N	2025-09-13 11:00:07.697836	2025-09-27 09:12:42.373125	6f8866d1-8bc0-4617-b2a7-62076abe2f92	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	+919033820268	C902	f
d93386aa-42b0-403a-998b-ac94c410a7fd	Unnamed Customer	unnamed.customer.9925364233@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-09-27 16:10:44.809121	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	9925364233	A602	t
aad02ebc-b79a-41da-aa7b-06063b213dcb	Unnamed Customer	unnamed.customer.9723696317@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-08-24 13:27:43.601	\N	f2a28bff-0ea9-404f-aa7e-3dc990df35de	31bee844-5496-4f82-9b91-8d8a0a87e8d6	9723696317	Referance From Paras	f
64e589f8-2394-4921-8351-b19082e45e59	Unnamed Customer	unnamed.customer.7600104554@customer.shreedharismart.com	\N	2025-08-10 12:33:15.378	2025-08-25 19:35:22.094	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	3b693c2e-2c1f-4bc8-8a69-f961e6359a26	7600104554	B602	f
f6d70034-ca4c-4fbf-a8bb-c52dc366eaa0	Apexxa Joshi	apexxa.joshi.8320334811@customer.shreedharismart.com	\N	2025-08-24 13:26:41.385	2025-08-25 19:34:53.666	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	8320334811	C1203	f
83ba0368-cde5-4cd5-960b-89283d191b77	Unnamed Customer	unnamed.customer.8141243741@customer.shreedharismart.com	\N	2025-08-24 13:26:41.438	2025-08-25 19:34:44.326	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	8141243741	A1202	f
117e9890-424b-4214-ab5e-de1aa198da10	Unnamed Customer	unnamed.customer.8734042496@customer.shreedharismart.com	\N	2025-08-24 13:26:41.48	2025-08-24 13:27:44.813	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	8734042496	A903	f
82efca2c-eda9-4458-8eb9-a5746c0380f0	Vaishali Ranpara	vaishali.ranpara.6354540794@customer.shreedharismart.com	\N	2025-08-24 13:26:41.521	2025-08-24 13:27:44.856	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	6354540794	A1001	f
581736df-45e2-4d92-b3de-c5d1e075f05a	Unnamed Customer	unnamed.customer.9429150954@customer.shreedharismart.com	\N	2025-08-24 13:26:41.565	2025-08-24 14:46:05.24	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	3b693c2e-2c1f-4bc8-8a69-f961e6359a26	9429150954	B604	f
98a27a1c-4f43-45f0-b6d8-2c5165327730	Patel Rita Ben	patel.rita.ben.6355032113@customer.shreedharismart.com	\N	2025-09-03 21:02:13.703	2025-09-14 19:48:55.919	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	6355032113	C1403	f
b572d8f9-3a0e-4b04-aaa1-fd0ed946244e		.8000709161@customer.shreedharismart.com	\N	2025-09-03 21:04:50.904	2025-09-03 21:04:50.904	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	3b693c2e-2c1f-4bc8-8a69-f961e6359a26	8000709161	B1001	f
d5429c6e-5172-48ff-b24a-dd4a0896b9e3	Janvi	janvi.7861080078@customer.shreedharismart.com	\N	2025-09-03 21:07:50.027	2025-09-14 19:48:44.059	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	7861080078	C702	f
c957abc0-fd67-4ad9-b9f4-de8a5ad4c6a1		.9173431820@customer.shreedharismart.com	\N	2025-09-03 21:09:49.031	2025-09-03 21:09:49.031	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	9173431820	A803	f
d3a63b74-30b5-4fa9-96dd-cc724fa26b54	Ruchita Nayak	ruchita.nayak.9106539744@customer.shreedharismart.com	\N	2025-09-03 21:11:20.215	2025-09-14 19:48:21.632	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	9106539744	A804	f
b4c0c351-1d47-4bca-9470-121e91100db1		.8758958376@customer.shreedharismart.com	\N	2025-09-03 21:17:17.114	2025-09-03 21:17:17.114	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	8758958376	A901	f
e6027508-add9-4b40-9876-2e81be9e230b		.9911103325@customer.shreedharismart.com	\N	2025-09-04 22:03:41.66	2025-09-04 22:03:41.66	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	3b693c2e-2c1f-4bc8-8a69-f961e6359a26	9911103325	B301	f
89dcb597-d9eb-477e-846e-4656b66578a4	Sanjay Punani	sanjay.punani.9033820268@customer.shreedharismart.com	\N	2025-09-07 16:37:41.474	2025-09-07 16:37:41.474	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	9033820268	C902	f
6187a88d-d45f-412d-bf18-a70288520cba		.8696871787@customer.shreedharismart.com	\N	2025-09-09 18:39:43.381	2025-09-09 18:39:43.381	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	3b693c2e-2c1f-4bc8-8a69-f961e6359a26	8696871787	B501	f
e4033df6-94f0-4b62-bd9c-bd29307f8039		.9727953441@customer.shreedharismart.com	\N	2025-09-09 18:42:54.174	2025-09-09 18:42:54.174	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	9727953441	C1402	f
57953160-7717-404b-a36f-545877ff4064	n/a	n/a.9328263862@customer.shreedharismart.com	\N	2025-09-09 19:07:18.613	2025-09-17 22:09:31.389	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	3b693c2e-2c1f-4bc8-8a69-f961e6359a26	9328263862	B703	f
52e679f8-cd31-41f4-a453-8c709b9e525f	Renu Thakkar	renu.thakkar.9023710118@customer.shreedharismart.com	\N	2025-09-09 20:00:22.6	2025-09-17 22:08:21.602	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	3b693c2e-2c1f-4bc8-8a69-f961e6359a26	9023710118	B403	f
1ce5ed40-b6ce-4c63-b09e-50a0f93eba8a	NA	na.7990172437@customer.shreedharismart.com	\N	2025-09-09 20:31:28.349	2025-09-19 20:15:55.598	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	7990172437	C1303	f
9ff0c02d-68e8-49a1-9c58-eac2876efcad	Asha	asha.9503611193@customer.shreedharismart.com	\N	2025-09-09 21:53:18.599	2025-09-09 21:53:18.599	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	bb92610d-dc2d-4dbe-87c7-74c45b2303e4	9503611193	C802	f
93e8e1b3-205a-4e0a-8c8e-477998a959c3	n/a	n/a.8866601111@customer.shreedharismart.com	\N	2025-09-19 20:50:30.829	2025-09-19 20:50:30.829	\N	126c6d3b-18ee-47f9-8735-1ea53de8ab24	a593d83f-1a8c-4d34-acc0-0254fb525665	8866601111	A301	f
a433b5e7-f4d7-4bfc-951e-207a4f4a7b3e	Unnamed Customer	unnamed.customer.9741857957@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-09-20 06:13:12.114478	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	3b693c2e-2c1f-4bc8-8a69-f961e6359a26	9741857957	B802	f
dbadc31c-00e1-4d7e-8be9-4a8627d32674	n/a	.8780218741@customer.shreedharismart.com	\N	2025-09-17 21:00:35.69	2025-09-20 06:15:12.324233	\N	6e5d02a6-8a98-4f4a-beb2-6610757a9fed	1c30e824-4f70-41a0-a0f2-36a0daf6f9d1	8780218741	A302	f
b074c69d-6af7-4237-819e-87142d4d6c66	N/A	n/a.9638390799@customer.shreedharismart.com	\N	2025-09-17 21:01:19.413	2025-09-20 06:16:30.777056	\N	6e5d02a6-8a98-4f4a-beb2-6610757a9fed	52b09c43-ee50-4e6c-9e2e-bda1fc5366e8	9638390799	C402	f
11dfff00-3c8b-416f-9a4a-3b7a1480083d	Unnamed Customer	unnamed.customer.6352952533@customer.shreedharismart.com	\N	2025-08-07 22:45:26.72	2025-09-21 10:41:09.997047	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	6352952533	A802	t
675b8827-9e6b-42b3-a9b0-aab88acfbdae	Jagruti	noemail12@gmail.com	\N	2025-09-27 14:45:34.456254	2025-09-27 14:45:34.456254	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	3b693c2e-2c1f-4bc8-8a69-f961e6359a26	9687120904	B701	f
3fc57ae6-1c69-4773-8e99-3277b4ccd098	N/A	abc@gmail.com	\N	2025-10-02 13:25:53.758982	2025-10-02 13:25:53.758982	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	7069509229	A-1103	f
ee1e1434-c633-4465-a0b5-daf76ce52557	N A	B401@gmail.com	\N	2025-10-02 14:03:47.66344	2025-10-02 14:03:47.66344	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	3b693c2e-2c1f-4bc8-8a69-f961e6359a26	6354755591	B 401	f
95483567-3c7b-43d0-9a20-86918e153a09	Navghan Satvara	navghan@gmail.com	\N	2025-10-03 15:10:42.116456	2025-10-03 15:10:42.116456	\N	126c6d3b-18ee-47f9-8735-1ea53de8ab24	5c161657-72da-4576-b2b3-327760c9c4f9	8905227054	B 402	f
cbdd5c3e-c7a8-4e41-90c9-feec771fff18	Mohini Patel	c3047thparisar@gmail.com	\N	2025-10-07 15:03:51.799279	2025-10-07 15:32:58.977609	\N	92554ea2-b228-452f-a554-a98523f7730f	9c84a0c7-7698-4fc6-b74f-b8c189ab5b54	917383681203	C304	f
c11e2dc5-754b-45af-834f-3f037c91ab87	N/A	noemail1003@gmail.com	\N	2025-10-11 15:30:49.032993	2025-10-11 15:30:49.032993	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	9327159980	A1003	f
165c87f4-6ea0-4d4f-b231-b07ebcc299b0	NA	c504swarnim@gmail.com	\N	2025-10-11 16:10:24.858346	2025-10-11 16:10:24.858346	\N	6e5d02a6-8a98-4f4a-beb2-6610757a9fed	52b09c43-ee50-4e6c-9e2e-bda1fc5366e8	9033020547	C504	f
e88595e2-5ee9-462d-b094-1a64c9379e04	Vaibhavee Patel	noemail@gmail.com	\N	2025-09-27 12:11:01.413779	2025-10-11 16:27:13.064115	\N	63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	e1fb1cf1-1090-454f-aad8-48ef79b6565d	7046402191	A601	t
\.


--
-- TOC entry 3513 (class 0 OID 65925)
-- Dependencies: 224
-- Data for Name: monthly_bills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.monthly_bills (id, "customerId", "billNumber", "billingMonth", "billingYear", "totalAmount", "orderCount", status, "dueDate", "sentAt", "paidAt", "createdAt", "updatedAt") FROM stdin;
6d7d0076-147e-4d21-a567-88ab74c31db2	d93386aa-42b0-403a-998b-ac94c410a7fd	MB-2025-09-0002	2025-09	2025	772.50	4	draft	2025-10-15 00:00:00	\N	\N	2025-09-27 16:15:45.988122	2025-09-27 16:24:19.711599
\.


--
-- TOC entry 3507 (class 0 OID 41376)
-- Dependencies: 218
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, "orderId", "productId", quantity, price, total, "orderedQuantity", "pricePerBaseUnit", "baseQuantity", "finalPrice", "createdAt", unit) FROM stdin;
05c8bb30-2c75-4a81-979d-c501958b9021	14076e5c-6c1b-493e-b763-ee8c7086d48e	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	70.00	35.00	250	70.00	500	35.00	2025-10-07 14:50:20.459073	gm
d2c3aa06-de8e-4f86-b74c-3c1ca6a5e7e8	14076e5c-6c1b-493e-b763-ee8c7086d48e	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 14:50:20.459073	gm
96e73f67-cc36-4ec6-8d96-20adaa4dc8fa	14076e5c-6c1b-493e-b763-ee8c7086d48e	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-07 14:50:20.459073	gm
aef1f26a-f5a4-48a3-a470-4db2ae3a2a98	14076e5c-6c1b-493e-b763-ee8c7086d48e	43f5ae1c-ecad-4e22-9825-712dde5d647e	500	60.00	60.00	500	60.00	500	60.00	2025-10-07 14:50:20.459073	gm
7d87f859-d3d6-4b97-8e98-0128d5b05e92	14076e5c-6c1b-493e-b763-ee8c7086d48e	feb933e8-b9cb-4046-978c-f8619c693eb5	150	50.00	15.00	150	50.00	500	15.00	2025-10-07 14:50:20.459073	gm
4676cc63-b80a-4491-9ab0-94dfe106d55f	14076e5c-6c1b-493e-b763-ee8c7086d48e	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	150	50.00	15.00	150	50.00	500	15.00	2025-10-07 14:50:20.459073	gm
ff69fc57-16a7-4704-aad6-0bcaab86e618	14076e5c-6c1b-493e-b763-ee8c7086d48e	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-10-07 14:50:20.459073	kg
fc18a688-253d-4b1c-8c34-cb5611bf3c73	14076e5c-6c1b-493e-b763-ee8c7086d48e	c623d1cc-09b3-48ae-96c1-e996053ab84a	100	20.00	20.00	100	20.00	100	20.00	2025-10-07 14:50:20.459073	gm
e48bed88-875c-4a01-8cce-88de6d6f437f	14076e5c-6c1b-493e-b763-ee8c7086d48e	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 14:50:20.459073	gm
aeb43903-ffd8-454e-a6d1-8fffcd6e7b3d	29beac97-bc73-42f7-87fb-a4d05bff9a4b	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.357	gm
80d5f235-4927-46f4-bf81-06ba89e6bb05	29beac97-bc73-42f7-87fb-a4d05bff9a4b	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:06.36	gm
4001b632-ed79-459a-abf7-8cb5ed84fb63	29beac97-bc73-42f7-87fb-a4d05bff9a4b	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:06.361	gm
35a37b1a-f79c-41b9-95a8-474244743b4f	29beac97-bc73-42f7-87fb-a4d05bff9a4b	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:06.363	gm
39a42d22-c301-436a-b1cb-5bffa825f5ff	29beac97-bc73-42f7-87fb-a4d05bff9a4b	7687b526-7d4f-40e5-b274-c66cca337009	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:06.364	gm
e81a0fb7-7892-49dd-9d29-c1c317cc0574	29beac97-bc73-42f7-87fb-a4d05bff9a4b	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.365	gm
4fa205be-5ca8-4d8a-b363-6400787b25a3	29beac97-bc73-42f7-87fb-a4d05bff9a4b	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:06.366	pc
dba0205c-ec84-4d36-b19d-05fa97897a03	cfc74563-b33a-4062-8dc6-6ddd3555ff58	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:06.386	pc
9b7ba2c9-669a-4bc5-a4a0-9bc328d637b6	cfc74563-b33a-4062-8dc6-6ddd3555ff58	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:06.387	gm
04d1e830-b642-4e9d-abee-c0b9faaac91c	cfc74563-b33a-4062-8dc6-6ddd3555ff58	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:06.388	gm
8ba6fb4a-5a81-49cd-9682-3ae2a350234c	cfc74563-b33a-4062-8dc6-6ddd3555ff58	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.389	gm
a994d23f-c0cc-4ce1-b703-0f9780755a64	e88cb5b9-2d14-4bde-8dad-2f9131557e94	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.413	gm
f5bfb300-967c-4583-8510-7f8346d585f5	e88cb5b9-2d14-4bde-8dad-2f9131557e94	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.416	gm
7a7703f7-af13-478b-a2e7-a20cefbcce3e	e88cb5b9-2d14-4bde-8dad-2f9131557e94	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.417	gm
25b98b79-6b64-4bab-898b-71cc79ccc5fb	e88cb5b9-2d14-4bde-8dad-2f9131557e94	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:06.418	pc
63f940c8-f67d-4c67-af27-a027561a2dce	e88cb5b9-2d14-4bde-8dad-2f9131557e94	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.419	gm
4814b787-52d0-4996-911d-f86d7b582bbd	e88cb5b9-2d14-4bde-8dad-2f9131557e94	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:06.42	gm
d8c588ca-48fe-465c-b9f4-b79f09d7b9ac	60b233a9-819b-40a7-bd41-d7db29c03a7e	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:06.452	gm
e0097e3f-4c06-468c-a376-6e8027ffa41c	60b233a9-819b-40a7-bd41-d7db29c03a7e	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:06.455	gm
e48aabd6-3ae4-4259-9a3f-b570243130ac	60b233a9-819b-40a7-bd41-d7db29c03a7e	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:06.457	gm
c8d0f3e3-9314-4633-8614-de492d1dbf89	754878fe-b1e0-453f-8acb-31db64755bdd	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.477	gm
2fddb9cd-85f4-421f-b04e-451f54d50fa0	754878fe-b1e0-453f-8acb-31db64755bdd	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.479	gm
7b82e185-ba47-4013-8f73-96af72d9bc1a	754878fe-b1e0-453f-8acb-31db64755bdd	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:06.48	pc
3322fb1d-2cf3-4dfb-9649-41bee306b1ce	754878fe-b1e0-453f-8acb-31db64755bdd	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:06.481	gm
0b100b25-5954-4e82-bbd2-fc4437cea0fc	5f6b8149-6789-4539-9224-d584c79be819	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.508	gm
f55ada03-5231-40b5-846f-6f3f2c3bd26a	5f6b8149-6789-4539-9224-d584c79be819	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:06.51	gm
67981e2e-afd4-44fd-8a58-c8519959a744	5f6b8149-6789-4539-9224-d584c79be819	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:06.512	gm
beb1e079-0bcd-41d5-846a-bb6c70f8b412	b06acac3-d70e-4372-a269-3a532531faed	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	60.00	60.00	500	120.00	1000	60.00	2025-09-27 15:42:06.535	gm
a9bcc305-ce0f-4ce9-a54a-25efabf0fec1	b06acac3-d70e-4372-a269-3a532531faed	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.538	gm
c761e8ef-ebef-42a9-8c10-b74806ae4ac9	b06acac3-d70e-4372-a269-3a532531faed	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:06.539	gm
c2040523-7733-48b4-8f30-c81439a59b17	b06acac3-d70e-4372-a269-3a532531faed	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.54	gm
d147f879-a030-4a4d-be56-772092789e89	c12fbe1e-1c7c-41cb-972b-364961ec76f4	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.561	gm
ab9cda3c-93e7-4103-b2cf-b68b6349d884	c12fbe1e-1c7c-41cb-972b-364961ec76f4	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:06.563	gm
5eb75a67-5598-4a3d-8fb1-53003ad50bbc	90b517a2-d1ad-4a92-b4f8-0671622171c3	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:06.595	gm
521addda-ce5e-4b3f-a8eb-4ac66a223beb	90b517a2-d1ad-4a92-b4f8-0671622171c3	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.597	gm
dcbe0af4-46fe-4962-b964-67eed32a8665	90b517a2-d1ad-4a92-b4f8-0671622171c3	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:06.598	gm
d413b712-665e-41aa-b4a3-d55cc0b25d83	90b517a2-d1ad-4a92-b4f8-0671622171c3	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:06.599	gm
2dc2b1e0-2fd8-4c46-8cda-dd7a1e97ac9e	e75e6bdd-887c-49c3-9e95-de4ec13064f4	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.617	gm
b40ffce3-5217-4fbc-b3d5-7ca95b48f771	e75e6bdd-887c-49c3-9e95-de4ec13064f4	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.62	gm
72e82355-8b69-4718-81f8-7384708281ec	e75e6bdd-887c-49c3-9e95-de4ec13064f4	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.622	gm
1ceaf613-d920-4ef8-8b04-dd399927a9f3	e75e6bdd-887c-49c3-9e95-de4ec13064f4	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:06.623	gm
f54a09e2-362f-4592-8ddd-1ff2381952f3	c25c79f1-9436-430c-8c12-8449e3cbfecf	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.646	gm
1666e594-4712-4ece-b1dc-420b930af648	c25c79f1-9436-430c-8c12-8449e3cbfecf	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:06.648	gm
02f48f0e-68fd-4f8d-b708-6b69351108cd	c25c79f1-9436-430c-8c12-8449e3cbfecf	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:06.649	gm
786e1e09-7d03-43d5-9276-1328e2c24099	c25c79f1-9436-430c-8c12-8449e3cbfecf	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:06.65	gm
2ae2f6aa-98ab-4fea-bf20-28faa7c50c50	c25c79f1-9436-430c-8c12-8449e3cbfecf	738a0900-9798-424c-a3f6-04a98bcf3848	2	70.00	0.14	2	70.00	1000	0.14	2025-09-27 15:42:06.651	kg
eba189cb-6618-4ee7-8e50-c7c00f2f8f70	c25c79f1-9436-430c-8c12-8449e3cbfecf	7687b526-7d4f-40e5-b274-c66cca337009	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:06.652	gm
614209d6-d939-4ae0-81f6-8f3384cf118a	c25c79f1-9436-430c-8c12-8449e3cbfecf	43f5ae1c-ecad-4e22-9825-712dde5d647e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:06.652	gm
574fb9f1-f564-4310-96ba-586576aeced0	c25c79f1-9436-430c-8c12-8449e3cbfecf	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:06.653	gm
27e780c2-4642-4377-8870-8b1acc088e03	4926c9a6-79e8-4669-b5eb-94189af3c475	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.674	gm
909c9102-ffa6-4b6c-9710-3767288fcd84	4926c9a6-79e8-4669-b5eb-94189af3c475	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:06.676	gm
71531eca-d08a-4c3c-b889-2f28c8949470	4926c9a6-79e8-4669-b5eb-94189af3c475	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.677	gm
29ef99bb-5e4a-47b4-9280-6dc4d1accf9f	949670cd-e1fd-4574-85f6-589d45f2ef13	6c1e3d72-7d97-40bb-97b4-93059631140f	4	60.00	60.00	4	15.00	1	60.00	2025-09-27 15:42:06.699	pc
bb60ebfe-1b68-47a2-9220-a15c71101b0c	949670cd-e1fd-4574-85f6-589d45f2ef13	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.702	gm
336dab24-30db-4c8a-95a3-ab9e77f769ea	949670cd-e1fd-4574-85f6-589d45f2ef13	2eae0636-1fa4-4d47-855f-306125787b1e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:06.703	gm
95e588ad-f501-4aa7-b3a9-8bc4c51ca8e2	949670cd-e1fd-4574-85f6-589d45f2ef13	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	750	60.00	60.00	750	80.00	1000	60.00	2025-09-27 15:42:06.704	gm
fabbdd25-985e-4422-8917-d3f11c8851c7	6e3b41ba-c95f-4af3-8ae9-d4931cd5bc76	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-09-27 14:43:20.530997	pc
777b272a-ba08-4a02-bef2-fb684665b639	6e3b41ba-c95f-4af3-8ae9-d4931cd5bc76	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	50.00	50.00	500	50.00	500	50.00	2025-09-27 14:43:20.530997	gm
bffd2d11-9713-4e36-a5d7-bc98cd60de09	6e3b41ba-c95f-4af3-8ae9-d4931cd5bc76	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-09-27 14:43:20.530997	gm
484d2427-e4ed-4bf7-b7c1-b09c4370190a	6cf08f3d-4353-4feb-8c90-98ed438c57a5	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-09-27 16:54:24.680288	gm
0871945d-c794-4173-9bd4-db6d329bff42	6cf08f3d-4353-4feb-8c90-98ed438c57a5	6c1e3d72-7d97-40bb-97b4-93059631140f	3	15.00	45.00	3	15.00	1	45.00	2025-09-27 16:54:24.680288	pc
e1f854eb-9b87-419f-8c3d-96cd9af2e97e	6cf08f3d-4353-4feb-8c90-98ed438c57a5	c1c3bf43-b581-408e-9317-57d81fa7ae00	500	60.00	60.00	500	60.00	500	60.00	2025-09-27 16:54:24.680288	gm
14c0f4ec-7548-4c4e-9b2c-af8845bb48c9	6cf08f3d-4353-4feb-8c90-98ed438c57a5	bd71ec96-c096-496b-9993-b560661cbb48	1	40.00	80.00	1	40.00	500	80.00	2025-09-27 16:54:24.680288	kg
07bf508f-1735-434e-89a2-ca9044118c05	6cf08f3d-4353-4feb-8c90-98ed438c57a5	de8e800e-c915-4d26-9ff5-94701f51222d	1	30.00	60.00	1	30.00	500	60.00	2025-09-27 16:54:24.680288	kg
a0c7b893-3fa2-450d-85fd-6c1f514a406a	6cf08f3d-4353-4feb-8c90-98ed438c57a5	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	60.00	60.00	500	60.00	500	60.00	2025-09-27 16:54:24.680288	gm
3c29d08f-7171-4636-81ef-5f878189bd22	6cf08f3d-4353-4feb-8c90-98ed438c57a5	371c3ff4-639a-46a2-8103-95906e93fb5e	500	40.00	40.00	500	40.00	500	40.00	2025-09-27 16:54:24.680288	gm
07f93d0d-97c4-4ce1-bcf2-ee4dae3e2743	6cf08f3d-4353-4feb-8c90-98ed438c57a5	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	50.00	25.00	250	50.00	500	25.00	2025-09-27 16:54:24.680288	gm
26bdc2d8-32f6-4327-8c4f-87b03397080f	6cf08f3d-4353-4feb-8c90-98ed438c57a5	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-09-27 16:54:24.680288	gm
e01c54bf-e342-412b-889b-a611d9c912c2	6cf08f3d-4353-4feb-8c90-98ed438c57a5	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	15.00	100	15.00	2025-09-27 16:54:24.680288	gm
ea9ac383-0226-4fbc-8a4b-c39f6902f5d8	abeb90cc-8a5b-403f-a05c-0ca9febf6859	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	70.00	35.00	250	70.00	500	35.00	2025-10-02 14:30:01.089355	gm
b98ce617-8248-4463-a5fb-92aa99584422	abeb90cc-8a5b-403f-a05c-0ca9febf6859	de8e800e-c915-4d26-9ff5-94701f51222d	250	30.00	15.00	250	30.00	500	15.00	2025-10-02 14:30:01.089355	gm
42f73d1e-a76d-45e5-86ea-a605e0b9aba7	abeb90cc-8a5b-403f-a05c-0ca9febf6859	c1c3bf43-b581-408e-9317-57d81fa7ae00	250	70.00	35.00	250	70.00	500	35.00	2025-10-02 14:30:01.089355	gm
6a7cb551-94a3-4d27-93a0-5f80c62335c6	abeb90cc-8a5b-403f-a05c-0ca9febf6859	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-10-02 14:30:01.089355	kg
52a5e184-b0af-4cc0-882d-83629ad78856	abeb90cc-8a5b-403f-a05c-0ca9febf6859	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	15.00	100	15.00	2025-10-02 14:30:01.089355	gm
f9a45d7e-9aa1-4ec9-bd32-a5694c4c76b0	abeb90cc-8a5b-403f-a05c-0ca9febf6859	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-02 14:30:01.089355	gm
7acad253-fa5d-4d4c-acd6-20efd07e9c6e	7f9869f0-3b3d-4c82-8296-4d1e1b7b0487	371c3ff4-639a-46a2-8103-95906e93fb5e	250	50.00	25.00	250	50.00	500	25.00	2025-10-07 13:18:30.118358	gm
99a1be76-ca69-4b6b-b0ba-4d6cb3c2b076	7f9869f0-3b3d-4c82-8296-4d1e1b7b0487	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-07 13:18:30.118358	gm
3eb9bba3-a66e-4e6a-bd05-cae751716e0c	7f9869f0-3b3d-4c82-8296-4d1e1b7b0487	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 13:18:30.118358	gm
1f6626fc-cbb1-40e7-8cf5-fb188341aaeb	7f9869f0-3b3d-4c82-8296-4d1e1b7b0487	0653ab92-5171-418b-89d2-9e6b60482bbb	250	30.00	15.00	250	30.00	500	15.00	2025-10-07 13:18:30.118358	gm
907cbbbc-fd0f-4f42-8149-6b3e0060552e	7f9869f0-3b3d-4c82-8296-4d1e1b7b0487	c623d1cc-09b3-48ae-96c1-e996053ab84a	100	20.00	20.00	100	20.00	100	20.00	2025-10-07 13:18:30.118358	gm
9e95ce5c-1103-4e91-bce6-4ac04a3bdf6f	7f9869f0-3b3d-4c82-8296-4d1e1b7b0487	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 13:18:30.118358	gm
da65e31e-e592-46ee-b311-a0d578bb9d6f	e09f842e-c118-42c4-bc05-3c009294a168	738a0900-9798-424c-a3f6-04a98bcf3848	2	30.00	60.00	2	30.00	1000	60.00	2025-09-27 14:46:25.070606	kg
516c26a4-2c41-40b8-8eda-a7d516ba5217	e09f842e-c118-42c4-bc05-3c009294a168	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	30.00	500	30.00	2025-09-27 14:46:25.070606	gm
5c2fe93f-1505-498a-9a40-57f252b8b4bc	e09f842e-c118-42c4-bc05-3c009294a168	7fded13b-5795-4f23-a8ba-c1c830755b18	250	35.00	17.50	250	35.00	500	17.50	2025-09-27 14:46:25.070606	gm
3f2869c2-6ce5-49fb-8129-2026ea6dd402	e09f842e-c118-42c4-bc05-3c009294a168	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-09-27 14:46:25.070606	pc
12eb9e35-35e6-4292-9baa-b09038423065	e09f842e-c118-42c4-bc05-3c009294a168	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-09-27 14:46:25.070606	pc
b22462e7-76ad-4126-ba0a-27c8891995ab	e09f842e-c118-42c4-bc05-3c009294a168	371c3ff4-639a-46a2-8103-95906e93fb5e	250	40.00	20.00	250	40.00	500	20.00	2025-09-27 14:46:25.070606	gm
9c4e685b-774f-48fd-95a8-f9806472b6ff	5317f8bf-b7eb-4113-a55a-fc0cd194f740	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-09-28 03:52:44.415535	pc
87ff64bc-63eb-46c4-849f-e9b81aa41c3b	5317f8bf-b7eb-4113-a55a-fc0cd194f740	738a0900-9798-424c-a3f6-04a98bcf3848	500	30.00	15.00	500	30.00	1000	15.00	2025-09-28 03:52:44.415535	gm
34300a81-80ee-4b4a-8be7-5b39c545c476	5317f8bf-b7eb-4113-a55a-fc0cd194f740	81ee7d10-3404-4ae2-b740-8acf875e3ba2	300	50.00	30.00	300	50.00	500	30.00	2025-09-28 03:52:44.415535	gm
58895260-6071-4954-b313-8a0a3e46d722	5317f8bf-b7eb-4113-a55a-fc0cd194f740	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	30.00	500	30.00	2025-09-28 03:52:44.415535	gm
0c0c36e2-847b-4c5f-821a-d96c9d3622d1	5317f8bf-b7eb-4113-a55a-fc0cd194f740	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-09-28 03:52:44.415535	gm
cd3fdd5d-d4eb-45bb-8d04-613e9dbbcff6	7981cc6e-962c-453f-b3a5-b53cf2b24409	c623d1cc-09b3-48ae-96c1-e996053ab84a	200	20.00	40.00	200	20.00	100	40.00	2025-10-02 13:52:12.975953	gm
4e514fa9-5a0d-492a-99ec-4adc3ee5ff20	7981cc6e-962c-453f-b3a5-b53cf2b24409	371c3ff4-639a-46a2-8103-95906e93fb5e	250	50.00	25.00	250	50.00	500	25.00	2025-10-02 13:52:12.975953	gm
b5dc2aaa-8842-4ef3-a1bd-6551854f6720	7981cc6e-962c-453f-b3a5-b53cf2b24409	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-02 13:52:12.975953	pc
87485d1b-0b8f-4622-92ee-19444348caa9	7981cc6e-962c-453f-b3a5-b53cf2b24409	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	30.00	15.00	250	30.00	500	15.00	2025-10-02 13:52:12.975953	gm
31467ac2-751d-4dcf-a133-1d7dd04dabd9	7981cc6e-962c-453f-b3a5-b53cf2b24409	cba9a138-b913-47df-b1fa-61663c7603b0	1	30.00	60.00	1	30.00	500	60.00	2025-10-02 13:52:12.975953	kg
789b85ac-b012-414a-ba3c-e9867e5150c8	7981cc6e-962c-453f-b3a5-b53cf2b24409	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	60.00	30.00	250	60.00	500	30.00	2025-10-02 13:52:12.975953	gm
ce923834-795e-469e-96e0-7fbab1b5a07a	7981cc6e-962c-453f-b3a5-b53cf2b24409	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	25.00	12.50	250	25.00	500	12.50	2025-10-02 13:52:12.975953	gm
b313450f-47d0-45a3-93e7-145e6b367d78	7981cc6e-962c-453f-b3a5-b53cf2b24409	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	70.00	35.00	250	70.00	500	35.00	2025-10-02 13:52:12.975953	gm
bdd2c1e5-6946-47df-bc28-43c1255c6df6	7981cc6e-962c-453f-b3a5-b53cf2b24409	81ee7d10-3404-4ae2-b740-8acf875e3ba2	150	60.00	18.00	150	60.00	500	18.00	2025-10-02 13:52:12.975953	gm
130299cd-3af6-463f-8d59-e3984e79ac41	7981cc6e-962c-453f-b3a5-b53cf2b24409	6c1e3d72-7d97-40bb-97b4-93059631140f	2	20.00	40.00	2	20.00	1	40.00	2025-10-02 13:52:12.975953	pc
528e45eb-8dd8-4134-92d1-18b7c84a6b79	7981cc6e-962c-453f-b3a5-b53cf2b24409	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	1	25.00	50.00	1	25.00	500	50.00	2025-10-02 13:52:12.975953	kg
5d282159-8e56-437b-a5dc-687c8bb2088b	7981cc6e-962c-453f-b3a5-b53cf2b24409	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	30.00	500	30.00	2025-10-02 13:52:12.975953	gm
86827642-7d25-439b-ab30-cbdc4cba2f6e	7981cc6e-962c-453f-b3a5-b53cf2b24409	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-10-02 13:52:12.975953	kg
a451e027-feed-4df3-9d2e-5b47064da6f6	898474c4-a8dc-49e8-9cca-cbe06abc9a24	738a0900-9798-424c-a3f6-04a98bcf3848	2	30.00	60.00	2	30.00	1000	60.00	2025-10-07 14:57:46.559535	kg
ad1ff53a-d370-4ba7-ad7f-d0155133676d	898474c4-a8dc-49e8-9cca-cbe06abc9a24	371c3ff4-639a-46a2-8103-95906e93fb5e	500	50.00	50.00	500	50.00	500	50.00	2025-10-07 14:57:46.559535	gm
7b1cecab-171a-43fc-b3ff-058a857de0b6	898474c4-a8dc-49e8-9cca-cbe06abc9a24	c623d1cc-09b3-48ae-96c1-e996053ab84a	250	20.00	50.00	250	20.00	100	50.00	2025-10-07 14:57:46.559535	gm
29867a08-8dfc-44bf-b04f-2a5664547458	898474c4-a8dc-49e8-9cca-cbe06abc9a24	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-07 14:57:46.559535	pc
de90e56b-40d3-4edf-a1a5-0941d877dceb	898474c4-a8dc-49e8-9cca-cbe06abc9a24	7687b526-7d4f-40e5-b274-c66cca337009	2	50.00	100.00	2	50.00	1	100.00	2025-10-07 14:57:46.559535	pc
d3abf852-cc28-4c1e-afe0-c821218542ef	898474c4-a8dc-49e8-9cca-cbe06abc9a24	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	750	30.00	45.00	750	30.00	500	45.00	2025-10-07 14:57:46.559535	gm
3029bfb8-11b3-4d7e-a19c-d561dac25e44	898474c4-a8dc-49e8-9cca-cbe06abc9a24	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 14:57:46.559535	gm
2530f9d5-b356-4608-a686-34e3177986b5	898474c4-a8dc-49e8-9cca-cbe06abc9a24	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	50.00	500	50.00	2025-10-07 14:57:46.559535	gm
9bd1e4b3-8a5b-4b78-9462-d4b66e0e146e	898474c4-a8dc-49e8-9cca-cbe06abc9a24	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 14:57:46.559535	gm
9a214b71-2cf7-4c76-ae06-f5ca75d989a6	898474c4-a8dc-49e8-9cca-cbe06abc9a24	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	15.00	100	15.00	2025-10-07 14:57:46.559535	gm
3472a83a-da9c-4014-8e5f-0dc8b7a7b752	898474c4-a8dc-49e8-9cca-cbe06abc9a24	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	150	20.00	30.00	150	20.00	100	30.00	2025-10-07 14:57:46.559535	gm
d6233567-dce0-4b4b-bedf-2c080030cffe	898474c4-a8dc-49e8-9cca-cbe06abc9a24	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	500	50.00	50.00	500	50.00	500	50.00	2025-10-07 14:57:46.559535	gm
29ff9e88-a4f2-43b2-a0c2-6c68a49e5b6c	898474c4-a8dc-49e8-9cca-cbe06abc9a24	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	60.00	60.00	500	60.00	500	60.00	2025-10-07 14:57:46.559535	gm
92885289-a4e5-4092-b869-652299b331a4	898474c4-a8dc-49e8-9cca-cbe06abc9a24	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	70.00	70.00	500	70.00	500	70.00	2025-10-07 14:57:46.559535	gm
28317ce4-2c2a-4d8d-a789-765cee17a2f7	b6fa88b0-17ed-4ea7-be00-ad671d4a80ce	81ee7d10-3404-4ae2-b740-8acf875e3ba2	1	50.00	100.00	1	50.00	500	100.00	2025-09-27 14:48:31.988504	kg
f5fa3fb1-b2dd-47db-b7dd-4742297f08c9	b6fa88b0-17ed-4ea7-be00-ad671d4a80ce	738a0900-9798-424c-a3f6-04a98bcf3848	2	30.00	60.00	2	30.00	1000	60.00	2025-09-27 14:48:31.988504	kg
53fa1d2f-397f-4633-8ae5-758f06e741b1	b6fa88b0-17ed-4ea7-be00-ad671d4a80ce	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	1	25.00	50.00	1	25.00	500	50.00	2025-09-27 14:48:31.988504	kg
0ffcec6f-f21a-4e7c-9513-96ad6a4e331b	b6fa88b0-17ed-4ea7-be00-ad671d4a80ce	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	200	15.00	30.00	200	15.00	100	30.00	2025-09-27 14:48:31.988504	gm
e83319ae-78b8-4d36-8d7d-ce6f74aa3b5c	b6fa88b0-17ed-4ea7-be00-ad671d4a80ce	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	50.00	500	50.00	2025-09-27 14:48:31.988504	gm
5d68e2f1-8851-43c1-acb7-6051a953fc80	b6fa88b0-17ed-4ea7-be00-ad671d4a80ce	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-09-27 14:48:31.988504	gm
d508a37a-b2dc-4bae-89b7-24c86fe6954c	b6fa88b0-17ed-4ea7-be00-ad671d4a80ce	7fded13b-5795-4f23-a8ba-c1c830755b18	500	35.00	35.00	500	35.00	500	35.00	2025-09-27 14:48:31.988504	gm
bf90daf1-4421-4c70-9d43-1a7637f2ce32	645a371c-e674-4c42-9548-dd93a55ae35b	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	60.00	60.00	500	60.00	500	60.00	2025-10-02 13:54:05.281834	gm
99192e9e-79d7-46bc-bd5f-6a78fa34e8bb	645a371c-e674-4c42-9548-dd93a55ae35b	0653ab92-5171-418b-89d2-9e6b60482bbb	250	30.00	15.00	250	30.00	500	15.00	2025-10-02 13:54:05.281834	gm
038d172c-1bd4-4bd0-bb9f-b27365f46210	645a371c-e674-4c42-9548-dd93a55ae35b	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	70.00	70.00	500	70.00	500	70.00	2025-10-02 13:54:05.281834	gm
2b98e7b1-670d-4bc5-ab73-192a6d45f0fb	645a371c-e674-4c42-9548-dd93a55ae35b	bd71ec96-c096-496b-9993-b560661cbb48	500	40.00	40.00	500	40.00	500	40.00	2025-10-02 13:54:05.281834	gm
c343a7d2-172e-4c28-81d9-9b7296f95b54	645a371c-e674-4c42-9548-dd93a55ae35b	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	30.00	500	30.00	2025-10-02 13:54:05.281834	gm
5fdb320a-641b-48f8-8bbf-b4f832fc39d3	645a371c-e674-4c42-9548-dd93a55ae35b	c1c3bf43-b581-408e-9317-57d81fa7ae00	500	70.00	70.00	500	70.00	500	70.00	2025-10-02 13:54:05.281834	gm
32045139-1836-40d3-ad59-0f4876dff611	645a371c-e674-4c42-9548-dd93a55ae35b	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	20.00	50.00	250	20.00	100	50.00	2025-10-02 13:54:05.281834	gm
b2c335ef-e45e-4e12-8091-cda02721bd8f	6941194d-e85e-4b38-b0ee-7bb2bf2818d2	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-03 15:33:46.202997	pc
b367501a-a0c2-4dd3-a7ab-43c2186e338d	6941194d-e85e-4b38-b0ee-7bb2bf2818d2	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	30.00	15.00	250	30.00	500	15.00	2025-10-03 15:33:46.202997	gm
427c6278-7762-4abd-ba6f-333400fcdaf1	6941194d-e85e-4b38-b0ee-7bb2bf2818d2	cba9a138-b913-47df-b1fa-61663c7603b0	250	30.00	15.00	250	30.00	500	15.00	2025-10-03 15:33:46.202997	gm
983e26cb-8747-48e8-8e2c-2110be2774ac	6941194d-e85e-4b38-b0ee-7bb2bf2818d2	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	60.00	30.00	250	60.00	500	30.00	2025-10-03 15:33:46.202997	gm
46c2e7a5-7e61-4195-bcc1-52a9061e6623	6941194d-e85e-4b38-b0ee-7bb2bf2818d2	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-03 15:33:46.202997	gm
2c10bfb9-5198-401d-8045-c80cd4b8a507	6941194d-e85e-4b38-b0ee-7bb2bf2818d2	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-10-03 15:33:46.202997	kg
1a832507-72ee-4fd6-9996-f21312becf61	6941194d-e85e-4b38-b0ee-7bb2bf2818d2	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-03 15:33:46.202997	gm
c2fff327-3e83-4828-8533-e162c7eeef4f	6941194d-e85e-4b38-b0ee-7bb2bf2818d2	35660cc6-d186-4b87-9c97-3c07bbc5303f	100	25.00	5.00	100	25.00	500	5.00	2025-10-03 15:33:46.202997	gm
0b5c4a51-e5e9-4b2a-9988-665aee94eb64	ff9398e1-3f80-450f-8f82-a9e8b7566a3a	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 13:20:29.122379	gm
e7a3b910-abde-48d4-b9f3-3691da18c604	ff9398e1-3f80-450f-8f82-a9e8b7566a3a	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-07 13:20:29.122379	gm
533dc5d1-b2ec-4191-a4f4-78827e22c20b	898474c4-a8dc-49e8-9cca-cbe06abc9a24	cba9a138-b913-47df-b1fa-61663c7603b0	1	30.00	60.00	1	30.00	500	60.00	2025-10-07 14:57:46.559535	kg
f9e5cb20-d192-4cfd-82b5-16e4de5efaac	59a15149-4d06-4a0a-969b-30486ac6539e	738a0900-9798-424c-a3f6-04a98bcf3848	2	30.00	60.00	2	30.00	1000	60.00	2025-09-27 14:49:55.565012	kg
ed0f5355-efcd-440d-b85a-c0c128016e54	59a15149-4d06-4a0a-969b-30486ac6539e	7fded13b-5795-4f23-a8ba-c1c830755b18	100	35.00	7.00	100	35.00	500	7.00	2025-09-27 14:49:55.565012	gm
3c237f07-bab4-442f-9bbb-85b92be9ddc6	59a15149-4d06-4a0a-969b-30486ac6539e	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	30.00	500	30.00	2025-09-27 14:49:55.565012	gm
7f9fab53-6f8b-4d02-902d-bfeee57d5bca	59a15149-4d06-4a0a-969b-30486ac6539e	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-09-27 14:49:55.565012	pc
d973557f-b74d-4ca8-a91b-78cde0351575	59a15149-4d06-4a0a-969b-30486ac6539e	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-09-27 14:49:55.565012	pc
ce2a0e53-7bb9-4328-ae49-11c0ca4d818d	59a15149-4d06-4a0a-969b-30486ac6539e	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	55.00	27.50	250	55.00	500	27.50	2025-09-27 14:49:55.565012	gm
26ae5595-cafc-42bb-9e3a-685d893a6fa2	59a15149-4d06-4a0a-969b-30486ac6539e	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-09-27 14:49:55.565012	gm
1466b0f4-5fca-4b18-8d25-1753494dafaf	b8787c73-71e4-4e24-ba89-e6b87597d140	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-10-02 13:57:05.648449	kg
bbc6013a-96ba-4364-9c42-ce3fe96e6aa1	b8787c73-71e4-4e24-ba89-e6b87597d140	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	30.00	500	30.00	2025-10-02 13:57:05.648449	gm
8bd440a5-a692-4f40-b164-8772d6ec0101	b8787c73-71e4-4e24-ba89-e6b87597d140	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	60.00	30.00	250	60.00	500	30.00	2025-10-02 13:57:05.648449	gm
6bf96306-f96f-45d2-a834-a07b809c2b60	b8787c73-71e4-4e24-ba89-e6b87597d140	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	70.00	35.00	250	70.00	500	35.00	2025-10-02 13:57:05.648449	gm
124af9ef-472f-42c3-9a88-7f6e7bdc5b6a	b8787c73-71e4-4e24-ba89-e6b87597d140	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	60.00	30.00	250	60.00	500	30.00	2025-10-02 13:57:05.648449	gm
6e15c35b-c2e3-41e6-95ed-c35d088edb6f	b8787c73-71e4-4e24-ba89-e6b87597d140	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	250	25.00	12.50	250	25.00	500	12.50	2025-10-02 13:57:05.648449	gm
8e327516-27a3-480a-88e9-2457f85de42a	b8787c73-71e4-4e24-ba89-e6b87597d140	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-10-02 13:57:05.648449	gm
d3e967f5-b02f-4532-bd26-976f6192a0a6	b8787c73-71e4-4e24-ba89-e6b87597d140	2eae0636-1fa4-4d47-855f-306125787b1e	500	25.00	50.00	500	25.00	250	50.00	2025-10-02 13:57:05.648449	gm
3ba79fa0-8423-464a-89ff-973b89a695af	b8787c73-71e4-4e24-ba89-e6b87597d140	7fded13b-5795-4f23-a8ba-c1c830755b18	250	30.00	15.00	250	30.00	500	15.00	2025-10-02 13:57:05.648449	gm
3c579fb1-56fc-47d3-8764-9c25785e1024	b8787c73-71e4-4e24-ba89-e6b87597d140	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	30.00	500	30.00	2025-10-02 13:57:05.648449	gm
1ee5e45a-4f86-453a-a919-b8b7b5fb8c7b	b8787c73-71e4-4e24-ba89-e6b87597d140	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	20.00	50.00	250	20.00	100	50.00	2025-10-02 13:57:05.648449	gm
74ffe118-7ef4-436a-bfaf-692479224198	0f09c61f-e9f8-4cbd-a159-ee12a7c0843d	371c3ff4-639a-46a2-8103-95906e93fb5e	250	50.00	25.00	250	50.00	500	25.00	2025-10-03 15:33:57.904742	gm
ea42dd60-10fa-489e-a2e7-79fb88d373dd	0f09c61f-e9f8-4cbd-a159-ee12a7c0843d	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	60.00	30.00	250	60.00	500	30.00	2025-10-03 15:33:57.904742	gm
6605c6bc-5ac9-45f6-82fc-78837b820394	0f09c61f-e9f8-4cbd-a159-ee12a7c0843d	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	250	25.00	12.50	250	25.00	500	12.50	2025-10-03 15:33:57.904742	gm
cf205496-aa64-4c74-9904-dac8cb9c01a3	0f09c61f-e9f8-4cbd-a159-ee12a7c0843d	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	75.00	37.50	250	75.00	500	37.50	2025-10-03 15:33:57.904742	gm
7d16cd1e-47be-4ccd-ae78-1d92b1ddc184	0f09c61f-e9f8-4cbd-a159-ee12a7c0843d	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	60.00	30.00	250	60.00	500	30.00	2025-10-03 15:33:57.904742	gm
f20a8902-a680-4ad1-9b95-be4876593773	0f09c61f-e9f8-4cbd-a159-ee12a7c0843d	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-03 15:33:57.904742	pc
d7d3f897-ac38-43ea-b2a2-8373969b9ba8	7be4ede7-db99-4a1f-a120-a0a9a204a967	feb933e8-b9cb-4046-978c-f8619c693eb5	1	50.00	100.00	1	50.00	500	100.00	2025-10-03 15:34:07.021943	kg
1cc63820-f5b9-41b6-9668-fc108290246b	7be4ede7-db99-4a1f-a120-a0a9a204a967	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	70.00	70.00	500	70.00	500	70.00	2025-10-03 15:34:07.021943	gm
8009edf4-a585-450a-8793-2e9c747a0251	7be4ede7-db99-4a1f-a120-a0a9a204a967	de8e800e-c915-4d26-9ff5-94701f51222d	1	30.00	60.00	1	30.00	500	60.00	2025-10-03 15:34:07.021943	kg
4c1570d1-30c1-4277-a0e5-9a844ad357c4	7be4ede7-db99-4a1f-a120-a0a9a204a967	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	20.00	50.00	250	20.00	100	50.00	2025-10-03 15:34:07.021943	gm
390dc716-b499-4bae-a98f-68c426137063	7be4ede7-db99-4a1f-a120-a0a9a204a967	738a0900-9798-424c-a3f6-04a98bcf3848	2	30.00	60.00	2	30.00	1000	60.00	2025-10-03 15:34:07.021943	kg
6cc129a2-dcb0-4e04-b9a4-7a8eee878c41	7be4ede7-db99-4a1f-a120-a0a9a204a967	c623d1cc-09b3-48ae-96c1-e996053ab84a	250	20.00	50.00	250	20.00	100	50.00	2025-10-03 15:34:07.021943	gm
f24bc007-e7d3-4e6b-95f4-82f16ebf707e	7be4ede7-db99-4a1f-a120-a0a9a204a967	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-10-03 15:34:07.021943	pc
2188f3a8-e608-4442-bc91-30771d06c513	7be4ede7-db99-4a1f-a120-a0a9a204a967	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-03 15:34:07.021943	pc
a98feef0-2c89-44f7-95b3-1387cda76a07	7be4ede7-db99-4a1f-a120-a0a9a204a967	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	1	30.00	60.00	1	30.00	500	60.00	2025-10-03 15:34:07.021943	kg
541536d4-bb85-4b18-886f-c139dd97c075	7be4ede7-db99-4a1f-a120-a0a9a204a967	cba9a138-b913-47df-b1fa-61663c7603b0	1	30.00	60.00	1	30.00	500	60.00	2025-10-03 15:34:07.021943	kg
54445bd4-b4cf-4f45-b9b0-b5acf413743d	7be4ede7-db99-4a1f-a120-a0a9a204a967	35660cc6-d186-4b87-9c97-3c07bbc5303f	500	25.00	25.00	500	25.00	500	25.00	2025-10-03 15:34:07.021943	gm
1e279f37-7d45-455f-bdee-7ac9a7ccf05e	7be4ede7-db99-4a1f-a120-a0a9a204a967	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	1	70.00	140.00	1	70.00	500	140.00	2025-10-03 15:34:07.021943	kg
1e63c29d-9403-4758-b386-a2227b0eb4e2	7be4ede7-db99-4a1f-a120-a0a9a204a967	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	60.00	60.00	500	60.00	500	60.00	2025-10-03 15:34:07.021943	gm
19f09414-cf95-4d3f-900d-392b33a5da3e	0f331604-979c-44f9-a509-9df373341c18	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 13:21:29.364265	gm
1cd6e348-250b-4f98-aed3-c47bb83fcd20	0f331604-979c-44f9-a509-9df373341c18	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 13:21:29.364265	gm
64f4b241-1b67-48a1-930e-caeb94323b04	0f331604-979c-44f9-a509-9df373341c18	c623d1cc-09b3-48ae-96c1-e996053ab84a	250	20.00	50.00	250	20.00	100	50.00	2025-10-07 13:21:29.364265	gm
ae7ee95a-aee9-433a-aabc-2775f0bb253d	0f331604-979c-44f9-a509-9df373341c18	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	15.00	100	15.00	2025-10-07 13:21:29.364265	gm
ba629506-532e-411d-8c93-df9e67e1ff5b	49e79aff-9b4f-42fe-a104-32b08e1f4d76	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-07 14:58:44.553286	gm
b1098c41-9ce8-426a-b60f-1e8be0422ebe	49e79aff-9b4f-42fe-a104-32b08e1f4d76	7fded13b-5795-4f23-a8ba-c1c830755b18	100	30.00	6.00	100	30.00	500	6.00	2025-10-07 14:58:44.553286	gm
59a8c5f0-f48c-402c-a7a4-49b4ef799b7b	49e79aff-9b4f-42fe-a104-32b08e1f4d76	35660cc6-d186-4b87-9c97-3c07bbc5303f	150	25.00	7.50	150	25.00	500	7.50	2025-10-07 14:58:44.553286	gm
182d5ba2-af82-40f9-a09a-05fe3a5c663b	49e79aff-9b4f-42fe-a104-32b08e1f4d76	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-07 14:58:44.553286	gm
23eb3349-7d5c-4355-a851-f7750d67df5f	49e79aff-9b4f-42fe-a104-32b08e1f4d76	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-10-07 14:58:44.553286	kg
409bef16-98e5-453d-9704-0109064b0ae9	49e79aff-9b4f-42fe-a104-32b08e1f4d76	738a0900-9798-424c-a3f6-04a98bcf3848	500	30.00	15.00	500	30.00	1000	15.00	2025-10-07 14:58:44.553286	gm
f082fd74-7728-4cbc-9b3a-f36e806af586	0007337b-b2a5-4070-ab08-e3c30cfbaf1c	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	750	60.00	90.00	750	60.00	500	90.00	2025-09-27 14:50:26.073401	gm
79392985-d655-440e-9ecf-99b8b684f4d1	0007337b-b2a5-4070-ab08-e3c30cfbaf1c	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-09-27 14:50:26.073401	pc
f60ded38-12ae-4dc7-9f55-713c57c4aac1	0007337b-b2a5-4070-ab08-e3c30cfbaf1c	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	50.00	500	50.00	2025-09-27 14:50:26.073401	gm
3493e148-6631-4938-80e4-4d08007a02c8	0007337b-b2a5-4070-ab08-e3c30cfbaf1c	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	25.00	250	25.00	2025-09-27 14:50:26.073401	gm
8ec2e9cf-fc7b-4b95-a0d3-bf774c5121c5	fcab4f7f-da79-4f16-b74b-b7196278b926	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-10-02 13:59:01.530032	kg
7aada088-51ed-4f94-bab2-4901db976897	fcab4f7f-da79-4f16-b74b-b7196278b926	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-10-02 13:59:01.530032	gm
fb974d13-0f02-4991-a37e-624b3d2e3932	fcab4f7f-da79-4f16-b74b-b7196278b926	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-02 13:59:01.530032	pc
f77ae415-0573-47b3-9ec2-b3fc4489dcd3	fcab4f7f-da79-4f16-b74b-b7196278b926	c623d1cc-09b3-48ae-96c1-e996053ab84a	100	20.00	20.00	100	20.00	100	20.00	2025-10-02 13:59:01.530032	gm
0b1d932c-31b3-456f-88b9-e60cf6724e2a	fcab4f7f-da79-4f16-b74b-b7196278b926	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	30.00	15.00	250	30.00	500	15.00	2025-10-02 13:59:01.530032	gm
506c5e99-5bf7-4dc5-a718-a019ccdffb7e	fcab4f7f-da79-4f16-b74b-b7196278b926	7fded13b-5795-4f23-a8ba-c1c830755b18	250	30.00	15.00	250	30.00	500	15.00	2025-10-02 13:59:01.530032	gm
6bc9228c-4500-4556-bf99-337b95d399d6	cfc8a832-4613-49f1-a2f8-7dbe3559cb00	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	30.00	500	30.00	2025-10-02 14:31:14.603309	gm
1b55c5c7-147c-4aa7-9dc6-7cbf5cc606b0	cfc8a832-4613-49f1-a2f8-7dbe3559cb00	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	70.00	35.00	250	70.00	500	35.00	2025-10-02 14:31:14.603309	gm
666b5c0b-8739-47bc-8808-914b6c3f7942	cfc8a832-4613-49f1-a2f8-7dbe3559cb00	6c1e3d72-7d97-40bb-97b4-93059631140f	1	20.00	20.00	1	20.00	1	20.00	2025-10-02 14:31:14.603309	pc
c6866641-23ce-4baf-b0c9-d4b4c49ea878	cfc8a832-4613-49f1-a2f8-7dbe3559cb00	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	70.00	35.00	250	70.00	500	35.00	2025-10-02 14:31:14.603309	gm
291195d7-fd80-466a-95e0-5f75ebdece44	cfc8a832-4613-49f1-a2f8-7dbe3559cb00	371c3ff4-639a-46a2-8103-95906e93fb5e	250	50.00	25.00	250	50.00	500	25.00	2025-10-02 14:31:14.603309	gm
6daf16e5-a542-4ed0-9dea-2b61b8104518	686f32f0-994e-4f20-9ad9-2be6991eadab	de8e800e-c915-4d26-9ff5-94701f51222d	1	30.00	60.00	1	30.00	500	60.00	2025-10-08 02:55:00.987932	kg
f80c666a-b487-4fad-996c-4eedb97ef83b	686f32f0-994e-4f20-9ad9-2be6991eadab	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-10-08 02:55:00.987932	kg
730300de-806e-43e7-9be9-15acb0240682	686f32f0-994e-4f20-9ad9-2be6991eadab	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-08 02:55:00.987932	gm
60b838cb-19e7-4d90-89f2-6654b6c78790	686f32f0-994e-4f20-9ad9-2be6991eadab	35660cc6-d186-4b87-9c97-3c07bbc5303f	500	25.00	25.00	500	25.00	500	25.00	2025-10-08 02:55:00.987932	gm
4b1db7c1-d8e5-4b56-ac2a-88745aba1829	686f32f0-994e-4f20-9ad9-2be6991eadab	0653ab92-5171-418b-89d2-9e6b60482bbb	250	30.00	15.00	250	30.00	500	15.00	2025-10-08 02:55:00.987932	gm
7bbf427e-095f-46e5-ba0a-9e1762b0c2c9	686f32f0-994e-4f20-9ad9-2be6991eadab	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	70.00	70.00	500	70.00	500	70.00	2025-10-08 02:55:00.987932	gm
68991c09-cf2b-4313-b228-592f0638ddc2	686f32f0-994e-4f20-9ad9-2be6991eadab	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	70.00	35.00	250	70.00	500	35.00	2025-10-08 02:55:00.987932	gm
99bbb0ac-01e4-4b4e-aad0-b7cdd279902c	686f32f0-994e-4f20-9ad9-2be6991eadab	c1c3bf43-b581-408e-9317-57d81fa7ae00	250	70.00	35.00	250	70.00	500	35.00	2025-10-08 02:55:00.987932	gm
fb67f2d2-c1b8-4e09-9abe-33532d2baa5c	686f32f0-994e-4f20-9ad9-2be6991eadab	371c3ff4-639a-46a2-8103-95906e93fb5e	500	50.00	50.00	500	50.00	500	50.00	2025-10-08 02:55:00.987932	gm
4da77f76-42d7-469e-81ec-440e45aaccc3	686f32f0-994e-4f20-9ad9-2be6991eadab	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	30.00	500	30.00	2025-10-08 02:55:00.987932	gm
08b14ff1-0797-4508-92e9-89fb32cfbee5	686f32f0-994e-4f20-9ad9-2be6991eadab	c623d1cc-09b3-48ae-96c1-e996053ab84a	100	20.00	20.00	100	20.00	100	20.00	2025-10-08 02:55:00.987932	gm
faa43d87-cb9f-4a29-9546-3292c6e3b0dd	686f32f0-994e-4f20-9ad9-2be6991eadab	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-08 02:55:00.987932	gm
dd3db7f1-c1b7-4ae5-b3c4-9a863193fdc9	686f32f0-994e-4f20-9ad9-2be6991eadab	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	25.00	250	25.00	2025-10-08 02:55:00.987932	gm
e327f11e-3ebc-4bfc-8512-31c6f1daf011	686f32f0-994e-4f20-9ad9-2be6991eadab	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-10-08 02:55:00.987932	gm
d01bb7e4-79df-46b8-8d45-71d32405a1d4	7582e03e-86aa-4fc9-a8a4-ef63a41d6b91	c623d1cc-09b3-48ae-96c1-e996053ab84a	100	20.00	20.00	100	20.00	100	20.00	2025-10-11 16:13:45.254564	gm
f74acb5a-f582-4106-8c30-9347f2f07764	7582e03e-86aa-4fc9-a8a4-ef63a41d6b91	93269f85-eae4-4983-9dfa-6b3620dbcbe6	250	50.00	50.00	250	50.00	250	50.00	2025-10-11 16:13:45.254564	gm
6ad1b533-5b1f-4d07-93c9-bfeaebcfdc40	7582e03e-86aa-4fc9-a8a4-ef63a41d6b91	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-11 16:13:45.254564	pc
65b38033-bd02-4e47-a3c6-6c8ae5860b2c	7582e03e-86aa-4fc9-a8a4-ef63a41d6b91	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	200	15.00	30.00	200	15.00	100	30.00	2025-10-11 16:13:45.254564	gm
88c698d3-fc00-4fb6-a739-90098bdbec7a	7582e03e-86aa-4fc9-a8a4-ef63a41d6b91	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-10-11 16:13:45.254564	pc
0ff9d5de-964e-4f21-9c51-42e82691528f	33e1d817-f589-4d5e-b891-7fde45a83393	de8e800e-c915-4d26-9ff5-94701f51222d	1	30.00	60.00	1	30.00	500	60.00	2025-09-27 16:42:22.62405	kg
bf77c607-3941-4ba8-9e4b-23b08db11aa1	33e1d817-f589-4d5e-b891-7fde45a83393	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	60.00	30.00	250	60.00	500	30.00	2025-09-27 16:42:22.62405	gm
0a8c81a3-2285-4921-8573-4e1ba52e478c	33e1d817-f589-4d5e-b891-7fde45a83393	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	1	25.00	50.00	1	25.00	500	50.00	2025-09-27 16:42:22.62405	kg
31818632-2837-43f9-90e1-49fecba9aa23	33e1d817-f589-4d5e-b891-7fde45a83393	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-09-27 16:42:22.62405	pc
d2628c78-3690-40a8-b964-2e41d980d1f7	33e1d817-f589-4d5e-b891-7fde45a83393	371c3ff4-639a-46a2-8103-95906e93fb5e	500	40.00	40.00	500	40.00	500	40.00	2025-09-27 16:42:22.62405	gm
3d6fbe39-4c6b-4fff-b8d1-99d7021138c9	33e1d817-f589-4d5e-b891-7fde45a83393	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-09-27 16:42:22.62405	kg
750be2c3-f2e0-4f10-9652-800879926cf8	33e1d817-f589-4d5e-b891-7fde45a83393	371c3ff4-639a-46a2-8103-95906e93fb5e	500	40.00	40.00	500	40.00	500	40.00	2025-09-27 16:42:22.62405	gm
e1961aae-a55d-4636-9872-485b4104ce19	b337d580-8aad-4c75-8282-5e2413e3fa17	371c3ff4-639a-46a2-8103-95906e93fb5e	500	50.00	50.00	500	50.00	500	50.00	2025-10-02 14:31:25.929228	gm
19e0e4a3-83ca-4685-9c91-cfbb3286dfbd	b337d580-8aad-4c75-8282-5e2413e3fa17	6c1e3d72-7d97-40bb-97b4-93059631140f	3	20.00	60.00	3	20.00	1	60.00	2025-10-02 14:31:25.929228	pc
79016cab-14e5-4d76-9aca-8d4ed9191dc2	b337d580-8aad-4c75-8282-5e2413e3fa17	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	25.00	250	25.00	2025-10-02 14:31:25.929228	gm
b42b0a23-6c61-488c-a4a7-94ff2fd739a6	b337d580-8aad-4c75-8282-5e2413e3fa17	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	60.00	60.00	500	60.00	500	60.00	2025-10-02 14:31:25.929228	gm
f1b24531-7d8d-4c57-9105-fd6362a3e96e	b337d580-8aad-4c75-8282-5e2413e3fa17	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	500	75.00	75.00	500	75.00	500	75.00	2025-10-02 14:31:25.929228	gm
1fa44f76-4464-4756-a765-4d9871ab5583	b337d580-8aad-4c75-8282-5e2413e3fa17	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-10-02 14:31:25.929228	kg
0b8a908a-cbdc-4888-a025-d6f73914bc44	67b89474-55e0-47a8-80d4-edc27c89248d	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	200	15.00	30.00	200	15.00	100	30.00	2025-10-07 13:30:14.585665	gm
1f6e4527-70bb-4486-84e1-f7df94045266	67b89474-55e0-47a8-80d4-edc27c89248d	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-07 13:30:14.585665	gm
dbc2cc66-d0fc-40ff-83d4-c6d2df47ce3f	67b89474-55e0-47a8-80d4-edc27c89248d	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	70.00	35.00	250	70.00	500	35.00	2025-10-07 13:30:14.585665	gm
920cb9dd-e899-47d7-892f-f57170e8df0c	67b89474-55e0-47a8-80d4-edc27c89248d	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	50.00	25.00	250	50.00	500	25.00	2025-10-07 13:30:14.585665	gm
967d192f-cb10-4429-bb4c-d962b72743f9	af5767d4-87a0-4a9b-a005-9e0e5812c813	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	50.00	500	50.00	2025-10-07 15:10:24.164354	gm
042166d5-65bf-484d-ba5e-9b121b5864ba	af5767d4-87a0-4a9b-a005-9e0e5812c813	feb933e8-b9cb-4046-978c-f8619c693eb5	200	50.00	20.00	200	50.00	500	20.00	2025-10-07 15:10:24.164354	gm
d466c203-4954-4359-bbbd-d24fb2f83530	af5767d4-87a0-4a9b-a005-9e0e5812c813	81ee7d10-3404-4ae2-b740-8acf875e3ba2	300	60.00	36.00	300	60.00	500	36.00	2025-10-07 15:10:24.164354	gm
e9e9efdd-9b01-4e94-a671-53c1986c06bd	af5767d4-87a0-4a9b-a005-9e0e5812c813	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	15.00	100	15.00	2025-10-07 15:10:24.164354	gm
b3f1c313-1a53-4e60-a02f-a7ff86dafeef	af5767d4-87a0-4a9b-a005-9e0e5812c813	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	200	50.00	20.00	200	50.00	500	20.00	2025-10-07 15:10:24.164354	gm
c9964566-4578-466f-9b96-e0de813097b4	af5767d4-87a0-4a9b-a005-9e0e5812c813	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	25.00	12.50	250	25.00	500	12.50	2025-10-07 15:10:24.164354	gm
76fa482b-56df-4c1f-861e-4529ef78f106	0d28822d-5cea-4eee-8b9f-91c98ce06a69	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	500	50.00	50.00	500	50.00	500	50.00	2025-10-08 03:22:56.399451	gm
3c2f01da-dfe5-4096-9776-212a1fceba8e	0d28822d-5cea-4eee-8b9f-91c98ce06a69	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-10-08 03:22:56.399451	pc
b2bcdeb2-ab7b-4916-9095-48613c15ca85	0d28822d-5cea-4eee-8b9f-91c98ce06a69	cba9a138-b913-47df-b1fa-61663c7603b0	1	30.00	60.00	1	30.00	500	60.00	2025-10-08 03:22:56.399451	kg
7848c115-430a-4eb6-bec4-a1f3fd83b944	0d28822d-5cea-4eee-8b9f-91c98ce06a69	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	70.00	35.00	250	70.00	500	35.00	2025-10-08 03:22:56.399451	gm
1b111de7-13a0-4270-b800-c36479e2c057	0d28822d-5cea-4eee-8b9f-91c98ce06a69	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	70.00	35.00	250	70.00	500	35.00	2025-10-08 03:22:56.399451	gm
8c0f9185-d887-41c4-a270-72c68456c75d	0d28822d-5cea-4eee-8b9f-91c98ce06a69	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	20.00	50.00	250	20.00	100	50.00	2025-10-08 03:22:56.399451	gm
304d0a65-3fb4-487c-a4b0-bfbe8aaf571d	0d28822d-5cea-4eee-8b9f-91c98ce06a69	c623d1cc-09b3-48ae-96c1-e996053ab84a	250	20.00	50.00	250	20.00	100	50.00	2025-10-08 03:22:56.399451	gm
a8e119e6-cb72-4b44-aabd-206e16a86b0f	d6579e1e-da1d-42e8-8588-9aa65956ab4b	de8e800e-c915-4d26-9ff5-94701f51222d	1	40.00	80.00	1	40.00	500	80.00	2025-10-11 15:21:57.73137	kg
76f06154-e0f5-4292-9970-b2001f7da3a5	d6579e1e-da1d-42e8-8588-9aa65956ab4b	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	75.00	75.00	500	75.00	500	75.00	2025-10-11 15:21:57.73137	gm
2a972563-8bed-4647-a5aa-5193e451bd19	d6579e1e-da1d-42e8-8588-9aa65956ab4b	c1c3bf43-b581-408e-9317-57d81fa7ae00	500	80.00	80.00	500	80.00	500	80.00	2025-10-11 15:21:57.73137	gm
d2893ce4-d639-4412-aef1-b8cdfe51ab30	d6579e1e-da1d-42e8-8588-9aa65956ab4b	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-11 15:21:57.73137	pc
2229e186-4a3a-41bb-b03b-5236971ece2e	d6579e1e-da1d-42e8-8588-9aa65956ab4b	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	15.00	100	15.00	2025-10-11 15:21:57.73137	gm
5c413f8e-5add-4031-9843-70466626a819	d6579e1e-da1d-42e8-8588-9aa65956ab4b	bd71ec96-c096-496b-9993-b560661cbb48	500	40.00	40.00	500	40.00	500	40.00	2025-10-11 15:21:57.73137	gm
bc5eedc2-92b2-4ed8-910e-ed79b6a40f28	d6579e1e-da1d-42e8-8588-9aa65956ab4b	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	30.00	500	30.00	2025-10-11 15:21:57.73137	gm
d6499f26-3e40-4431-aba6-8e33e65001d1	d6579e1e-da1d-42e8-8588-9aa65956ab4b	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	40.00	500	40.00	2025-10-11 15:21:57.73137	gm
e837886b-0884-488a-8113-7728a56d076a	8b8d8f33-c68a-423b-9d94-aeef3ec68603	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-10-11 16:14:48.374289	pc
2250f2d5-ff43-4afd-886d-c91c6f703b54	8b8d8f33-c68a-423b-9d94-aeef3ec68603	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	40.00	500	40.00	2025-10-11 16:14:48.374289	gm
7f630c9b-9089-466a-ac8b-2473e8fa11b9	8b8d8f33-c68a-423b-9d94-aeef3ec68603	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	40.00	500	40.00	2025-10-11 16:14:48.374289	gm
f9642e28-af03-4e5d-a63e-5e44efbec9ca	8b8d8f33-c68a-423b-9d94-aeef3ec68603	feb933e8-b9cb-4046-978c-f8619c693eb5	250	50.00	25.00	250	50.00	500	25.00	2025-10-11 16:14:48.374289	gm
356d8377-374c-4a15-a619-a8fc2dae29ef	8b8d8f33-c68a-423b-9d94-aeef3ec68603	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	25.00	250	25.00	2025-10-11 16:14:48.374289	gm
14a1c531-7c94-4080-b4cd-4562c49f4c68	8b8d8f33-c68a-423b-9d94-aeef3ec68603	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	250	30.00	15.00	250	30.00	500	15.00	2025-10-11 16:14:48.374289	gm
5882ab5c-5fe4-401e-a3b8-299d7e49bd01	8b8d8f33-c68a-423b-9d94-aeef3ec68603	de8e800e-c915-4d26-9ff5-94701f51222d	500	40.00	40.00	500	40.00	500	40.00	2025-10-11 16:14:48.374289	gm
a43fff1e-b948-4b6c-ab78-97b65b6f40d8	8b8d8f33-c68a-423b-9d94-aeef3ec68603	738a0900-9798-424c-a3f6-04a98bcf3848	2	35.00	70.00	2	35.00	1000	70.00	2025-10-11 16:14:48.374289	kg
47d04f80-276a-4503-8b13-20f359d46717	8b8d8f33-c68a-423b-9d94-aeef3ec68603	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-11 16:14:48.374289	gm
67740033-a165-43f8-9651-744db49c1aed	67e1e182-80ea-43c2-882d-6be2e998ad4f	371c3ff4-639a-46a2-8103-95906e93fb5e	1	50.00	100.00	1	50.00	500	100.00	2025-10-12 03:46:23.530169	kg
807e6cdc-97e4-4d85-a27a-3643ab9e57a5	67e1e182-80ea-43c2-882d-6be2e998ad4f	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	1	30.00	60.00	1	30.00	500	60.00	2025-10-12 03:46:23.530169	kg
70fc1513-a243-41c0-9936-4914297a0cf4	67e1e182-80ea-43c2-882d-6be2e998ad4f	2eae0636-1fa4-4d47-855f-306125787b1e	500	25.00	50.00	500	25.00	250	50.00	2025-10-12 03:46:23.530169	gm
146bf72c-4968-42cb-84a3-17f28eaf472e	67e1e182-80ea-43c2-882d-6be2e998ad4f	c623d1cc-09b3-48ae-96c1-e996053ab84a	200	20.00	40.00	200	20.00	100	40.00	2025-10-12 03:46:23.530169	gm
c04cb644-29c2-4be0-a1ec-5a4a398685ff	67e1e182-80ea-43c2-882d-6be2e998ad4f	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-10-12 03:46:23.530169	pc
23319e4f-5a77-4b15-a175-90305e5c3a9a	67e1e182-80ea-43c2-882d-6be2e998ad4f	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	40.00	500	40.00	2025-10-12 03:46:23.530169	gm
ad9a8210-c377-425d-912d-2da840082533	67e1e182-80ea-43c2-882d-6be2e998ad4f	bd71ec96-c096-496b-9993-b560661cbb48	1	40.00	80.00	1	40.00	500	80.00	2025-10-12 03:46:23.530169	kg
6f4d7f9c-d3ea-40ae-89ed-4d5628d4e5c7	67e1e182-80ea-43c2-882d-6be2e998ad4f	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-12 03:46:23.530169	pc
ae023750-a563-4499-ad48-6bff6beef1d6	38cfbe43-c600-4024-a985-5416385e6be8	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	70.00	35.00	250	70.00	500	35.00	2025-10-02 14:33:41.851326	gm
86d386a8-f1e7-4a80-ae32-41696e24a307	38cfbe43-c600-4024-a985-5416385e6be8	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	30.00	500	30.00	2025-10-02 14:33:41.851326	gm
c75bfa38-d9fd-4e5e-ab59-8e332b66e908	38cfbe43-c600-4024-a985-5416385e6be8	bd71ec96-c096-496b-9993-b560661cbb48	250	40.00	20.00	250	40.00	500	20.00	2025-10-02 14:33:41.851326	gm
2b3e9465-4365-46da-a37e-1e6d2df9fc48	38cfbe43-c600-4024-a985-5416385e6be8	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	75.00	37.50	250	75.00	500	37.50	2025-10-02 14:33:41.851326	gm
df13bb86-9ebf-4029-9e39-69fe404e3ffa	38cfbe43-c600-4024-a985-5416385e6be8	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	15.00	100	15.00	2025-10-02 14:33:41.851326	gm
418afa9d-f2ce-4718-a7fd-463071226fb9	38cfbe43-c600-4024-a985-5416385e6be8	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-10-02 14:33:41.851326	kg
22eb6d7b-5204-4a65-a116-64432d9eb05a	38cfbe43-c600-4024-a985-5416385e6be8	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	70.00	70.00	500	70.00	500	70.00	2025-10-02 14:33:41.851326	gm
85999f7a-7ed7-4a4a-9ab8-d38b3a977e53	38cfbe43-c600-4024-a985-5416385e6be8	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-02 14:33:41.851326	gm
5ddc03ea-6857-4b47-a297-ad9f23635fb6	c23ac48e-102d-4b75-bd92-876a765202fe	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	75.00	37.50	250	75.00	500	37.50	2025-10-07 13:30:25.903864	gm
86b3e097-d84b-4a04-ac68-d4d92b20df4d	c23ac48e-102d-4b75-bd92-876a765202fe	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-10-07 13:30:25.903864	pc
26732079-8aa5-416b-97da-b0a0991c8718	c23ac48e-102d-4b75-bd92-876a765202fe	371c3ff4-639a-46a2-8103-95906e93fb5e	250	50.00	25.00	250	50.00	500	25.00	2025-10-07 13:30:25.903864	gm
0e240065-0c32-46f6-b309-02208f1ddbcc	c23ac48e-102d-4b75-bd92-876a765202fe	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-07 13:30:25.903864	pc
efb3ae0f-edf1-45f8-8082-07030526a245	c23ac48e-102d-4b75-bd92-876a765202fe	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	30.00	15.00	250	30.00	500	15.00	2025-10-07 13:30:25.903864	gm
82ce82bc-e054-4586-8575-7db3c1395e36	c23ac48e-102d-4b75-bd92-876a765202fe	cba9a138-b913-47df-b1fa-61663c7603b0	1	30.00	60.00	1	30.00	500	60.00	2025-10-07 13:30:25.903864	kg
b1952bd0-068a-4fa9-b79d-e45b8abfc243	c23ac48e-102d-4b75-bd92-876a765202fe	43f5ae1c-ecad-4e22-9825-712dde5d647e	500	60.00	60.00	500	60.00	500	60.00	2025-10-07 13:30:25.903864	gm
95cfb727-0e0c-40b7-8843-87ecb85042b8	c23ac48e-102d-4b75-bd92-876a765202fe	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	70.00	35.00	250	70.00	500	35.00	2025-10-07 13:30:25.903864	gm
e0e252be-7a7b-4543-b0b7-0f87ae1ce517	c23ac48e-102d-4b75-bd92-876a765202fe	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-07 13:30:25.903864	gm
856054b3-da71-4b01-be7f-18b0f432c9e3	c23ac48e-102d-4b75-bd92-876a765202fe	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-10-07 13:30:25.903864	kg
b4732e26-8533-44db-93ca-f02405181889	c23ac48e-102d-4b75-bd92-876a765202fe	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-07 13:30:25.903864	gm
b9138381-fbe3-45d0-8b94-7faa3574ef2b	b90fe439-daee-42b1-8af7-4992dd3928eb	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	250	15.00	37.50	250	15.00	100	37.50	2025-10-07 15:12:39.620179	gm
a8931d24-698e-4557-a2f8-acc53761e17a	b90fe439-daee-42b1-8af7-4992dd3928eb	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	700	30.00	42.00	700	30.00	500	42.00	2025-10-07 15:12:39.620179	gm
b9718421-2460-4fa7-b624-bc0ecc0dee54	b90fe439-daee-42b1-8af7-4992dd3928eb	62dcf014-3edf-4e2e-9279-8b495822fc47	100	15.00	15.00	100	15.00	100	15.00	2025-10-07 15:12:39.620179	gm
40e9920f-22f0-4826-8801-f4fbef923677	b90fe439-daee-42b1-8af7-4992dd3928eb	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-07 15:12:39.620179	gm
fdd9a5db-ff4e-4aa5-ba65-d83f56b60a42	b90fe439-daee-42b1-8af7-4992dd3928eb	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-07 15:12:39.620179	pc
e3d0b4a5-f072-4179-b95c-045325a828e9	b90fe439-daee-42b1-8af7-4992dd3928eb	371c3ff4-639a-46a2-8103-95906e93fb5e	250	50.00	25.00	250	50.00	500	25.00	2025-10-07 15:12:39.620179	gm
24bfb99d-41b5-4a21-950b-5c9dcd5bab97	b90fe439-daee-42b1-8af7-4992dd3928eb	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 15:12:39.620179	gm
98544695-c4f5-4e67-ae95-e1723072d07a	b90fe439-daee-42b1-8af7-4992dd3928eb	0653ab92-5171-418b-89d2-9e6b60482bbb	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 15:12:39.620179	gm
c218afa5-1d17-4879-8e6c-e6a375d3357c	570ceb3c-dec0-4bff-9a8d-2796924bd37d	69a3bbb1-2538-40c2-8a1a-c5dc78485bb3	500	50.00	50.00	500	50.00	500	50.00	2025-10-11 15:22:24.60996	gm
25f8a6c7-9679-4354-a0a5-6a6c973567f6	570ceb3c-dec0-4bff-9a8d-2796924bd37d	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	75.00	75.00	500	75.00	500	75.00	2025-10-11 15:22:24.60996	gm
d1693e5a-9b4c-4bfb-8b59-50ccdfe889bf	570ceb3c-dec0-4bff-9a8d-2796924bd37d	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	250	15.00	37.50	250	15.00	100	37.50	2025-10-11 15:22:24.60996	gm
cbaa0d4e-aec2-4c2b-97a9-ef329893915b	b94337f0-00aa-4b3a-915d-2102ab86c043	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	30.00	500	30.00	2025-10-11 16:15:20.994706	gm
5eac80b0-0b4e-4808-a536-cd71008868fd	b94337f0-00aa-4b3a-915d-2102ab86c043	738a0900-9798-424c-a3f6-04a98bcf3848	1	35.00	35.00	1	35.00	1000	35.00	2025-10-11 16:15:20.994706	kg
fd8b239b-3c5a-4ddc-b38c-34977f4fe07c	58ceba33-35f5-44a0-9eef-83ee3a53090c	c623d1cc-09b3-48ae-96c1-e996053ab84a	100	20.00	20.00	100	20.00	100	20.00	2025-10-12 05:49:53.094927	gm
4e218683-812d-4a56-bf64-dd819ecca536	58ceba33-35f5-44a0-9eef-83ee3a53090c	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	40.00	500	40.00	2025-10-12 05:49:53.094927	gm
470ee89e-4865-48a0-9695-9a6437af7274	58ceba33-35f5-44a0-9eef-83ee3a53090c	69a3bbb1-2538-40c2-8a1a-c5dc78485bb3	250	50.00	25.00	250	50.00	500	25.00	2025-10-12 05:49:53.094927	gm
1d1f45d5-ce00-41f4-9f58-38d5f7bb972f	58ceba33-35f5-44a0-9eef-83ee3a53090c	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	15.00	100	15.00	2025-10-12 05:49:53.094927	gm
521ec13e-9d93-4c13-b459-19ca453b6c6e	58ceba33-35f5-44a0-9eef-83ee3a53090c	738a0900-9798-424c-a3f6-04a98bcf3848	1	35.00	35.00	1	35.00	1000	35.00	2025-10-12 05:49:53.094927	kg
6f6a87e4-ee56-49b1-b81f-910fba756a19	58ceba33-35f5-44a0-9eef-83ee3a53090c	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	25.00	250	25.00	2025-10-12 05:49:53.094927	gm
007316ec-57f1-4468-9ed5-a6559afd7d4e	58ceba33-35f5-44a0-9eef-83ee3a53090c	0653ab92-5171-418b-89d2-9e6b60482bbb	250	30.00	15.00	250	30.00	500	15.00	2025-10-12 05:49:53.094927	gm
9f087bf7-f07b-45b5-8f31-94331b526b2e	58ceba33-35f5-44a0-9eef-83ee3a53090c	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-12 05:49:53.094927	pc
f6eb7cb3-ceaa-466b-965a-6b651a2e78be	055b64cb-b349-4fa8-b0e4-70e725e8504f	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	60.00	30.00	250	60.00	500	30.00	2025-10-02 14:34:47.424712	gm
93846b57-4c11-443c-be13-913951516d21	055b64cb-b349-4fa8-b0e4-70e725e8504f	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	75.00	37.50	250	75.00	500	37.50	2025-10-02 14:34:47.424712	gm
657ec0a7-04d7-468b-9c6e-f8d4cc5fa2e1	055b64cb-b349-4fa8-b0e4-70e725e8504f	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	30.00	500	30.00	2025-10-02 14:34:47.424712	gm
94391947-8bb0-4b8c-b13d-f6322e0c5a3b	055b64cb-b349-4fa8-b0e4-70e725e8504f	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-10-02 14:34:47.424712	kg
5e7e6da7-65f8-4639-8f15-f05fa8d965ed	055b64cb-b349-4fa8-b0e4-70e725e8504f	62dcf014-3edf-4e2e-9279-8b495822fc47	100	15.00	15.00	100	15.00	100	15.00	2025-10-02 14:34:47.424712	gm
f8e766d9-0a91-4fb9-b5e0-8a240bac69e1	055b64cb-b349-4fa8-b0e4-70e725e8504f	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	25.00	250	25.00	2025-10-02 14:34:47.424712	gm
ca8adc3a-5b7c-4fe8-b675-312e6ebe32bd	2e4b92c5-45eb-43f0-9e01-c734a262702f	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-10-07 15:14:27.738812	kg
8b9a46bf-0788-4144-ae05-600d1cb5ed44	2e4b92c5-45eb-43f0-9e01-c734a262702f	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 15:14:27.738812	gm
88e6afa1-ef7a-4abf-b7ef-48bf920d8a59	2e4b92c5-45eb-43f0-9e01-c734a262702f	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-07 15:14:27.738812	pc
5f2beb46-2870-4836-8d00-87eb3845abdd	2e4b92c5-45eb-43f0-9e01-c734a262702f	7fded13b-5795-4f23-a8ba-c1c830755b18	250	30.00	15.00	250	30.00	500	15.00	2025-10-07 15:14:27.738812	gm
f73d8fa4-93b3-4e23-b969-7f35d255cb12	2e4b92c5-45eb-43f0-9e01-c734a262702f	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	70.00	35.00	250	70.00	500	35.00	2025-10-07 15:14:27.738812	gm
f56c2dc1-27aa-461e-9546-16c73477cf86	2e4b92c5-45eb-43f0-9e01-c734a262702f	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	25.00	250	25.00	2025-10-07 15:14:27.738812	gm
a453b199-c338-4556-945f-24fd627a92fb	2e4b92c5-45eb-43f0-9e01-c734a262702f	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	15.00	100	15.00	2025-10-07 15:14:27.738812	gm
39e224a7-1c58-4fd8-b5df-4b9efb2b9056	a8ff5b1e-0c8b-4d67-ac9e-5bec9577fc15	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-11 15:24:07.99221	pc
6710e6f0-b09a-44c3-a3ee-892dc988c815	a8ff5b1e-0c8b-4d67-ac9e-5bec9577fc15	cba9a138-b913-47df-b1fa-61663c7603b0	1	40.00	80.00	1	40.00	500	80.00	2025-10-11 15:24:07.99221	kg
bc9ece6e-5c59-44cc-81c9-d2930d679b58	a8ff5b1e-0c8b-4d67-ac9e-5bec9577fc15	7fded13b-5795-4f23-a8ba-c1c830755b18	100	30.00	6.00	100	30.00	500	6.00	2025-10-11 15:24:07.99221	gm
884a55b1-a7a4-41d8-b502-9d2d690473de	a8ff5b1e-0c8b-4d67-ac9e-5bec9577fc15	35660cc6-d186-4b87-9c97-3c07bbc5303f	150	25.00	7.50	150	25.00	500	7.50	2025-10-11 15:24:07.99221	gm
0dc7b1eb-0caa-4d08-acd8-0ca086fa0961	a8ff5b1e-0c8b-4d67-ac9e-5bec9577fc15	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	30.00	500	30.00	2025-10-11 15:24:07.99221	gm
5dde265a-da19-4ee9-be0f-434e10ff2866	a8ff5b1e-0c8b-4d67-ac9e-5bec9577fc15	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	15.00	100	15.00	2025-10-11 15:24:07.99221	gm
5a9f0fb9-c51f-4896-bef2-14eb36fe59c4	a8ff5b1e-0c8b-4d67-ac9e-5bec9577fc15	738a0900-9798-424c-a3f6-04a98bcf3848	1	35.00	35.00	1	35.00	1000	35.00	2025-10-11 15:24:07.99221	kg
a3588fb3-1e01-4f55-9e81-81a7a5e2222f	a8ff5b1e-0c8b-4d67-ac9e-5bec9577fc15	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-11 15:24:07.99221	gm
86c9b2c0-e994-4bd0-b792-d621348bc1dd	8fa30de7-fd27-490d-880a-ff8c55c8d31c	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	75.00	75.00	500	75.00	500	75.00	2025-10-11 16:16:39.330183	gm
81a79097-af94-432f-8a06-7fa5aea74269	8fa30de7-fd27-490d-880a-ff8c55c8d31c	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	200	20.00	40.00	200	20.00	100	40.00	2025-10-11 16:16:39.330183	gm
2bcb3f8c-d889-47c8-a1a7-6188176e520b	01e07026-65dd-4cf3-9ca3-fcb1f118db60	371c3ff4-639a-46a2-8103-95906e93fb5e	250	50.00	25.00	250	50.00	500	25.00	2025-10-02 14:35:10.853688	gm
cdb18ea3-d4e1-4413-ac03-58b879e3d179	01e07026-65dd-4cf3-9ca3-fcb1f118db60	c623d1cc-09b3-48ae-96c1-e996053ab84a	100	20.00	20.00	100	20.00	100	20.00	2025-10-02 14:35:10.853688	gm
dfc5fb02-81c0-450a-b465-5547690bbe2e	01e07026-65dd-4cf3-9ca3-fcb1f118db60	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-02 14:35:10.853688	pc
a3533710-11b8-4c4e-b252-7c8cb5208e25	01e07026-65dd-4cf3-9ca3-fcb1f118db60	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	30.00	15.00	250	30.00	500	15.00	2025-10-02 14:35:10.853688	gm
7e4c0d6b-4953-4652-9611-e647eaf9dd50	01e07026-65dd-4cf3-9ca3-fcb1f118db60	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	70.00	35.00	250	70.00	500	35.00	2025-10-02 14:35:10.853688	gm
07a14933-032c-46a9-af4f-e8bc43007645	01e07026-65dd-4cf3-9ca3-fcb1f118db60	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-02 14:35:10.853688	gm
dcad1cc1-3325-44ae-bda3-1d60aab79a20	01e07026-65dd-4cf3-9ca3-fcb1f118db60	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	15.00	100	15.00	2025-10-02 14:35:10.853688	gm
bccb1ced-ca44-4a21-b122-2ad7b5e4547a	01e07026-65dd-4cf3-9ca3-fcb1f118db60	738a0900-9798-424c-a3f6-04a98bcf3848	500	30.00	15.00	500	30.00	1000	15.00	2025-10-02 14:35:10.853688	gm
949b7b57-a846-4777-9bd7-f4ea4e67ac28	01e07026-65dd-4cf3-9ca3-fcb1f118db60	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	75.00	37.50	250	75.00	500	37.50	2025-10-02 14:35:10.853688	gm
acea8775-e027-4b5e-b8d4-ce16082e60a9	01e07026-65dd-4cf3-9ca3-fcb1f118db60	de8e800e-c915-4d26-9ff5-94701f51222d	2	30.00	120.00	2	30.00	500	120.00	2025-10-02 14:35:10.853688	kg
ca8957ea-4fcc-4136-b349-c84aeb73eeeb	f3bfb3cf-861e-404b-b4a3-4d2fa34d5e8f	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	30.00	15.00	250	30.00	500	15.00	2025-10-07 15:16:47.230859	gm
37936e87-13aa-40ef-8b57-7f2c3dbd2abb	f3bfb3cf-861e-404b-b4a3-4d2fa34d5e8f	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-07 15:16:47.230859	gm
a157ca6c-ef14-466f-bcf5-94043e36708c	f3bfb3cf-861e-404b-b4a3-4d2fa34d5e8f	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	25.00	250	25.00	2025-10-07 15:16:47.230859	gm
46bfdcdb-7f19-4444-9c7f-556dd6d5a8b7	f3bfb3cf-861e-404b-b4a3-4d2fa34d5e8f	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	15.00	100	15.00	2025-10-07 15:16:47.230859	gm
ae7849bb-8d2f-4c0f-a5ca-ab49aa0f0eeb	96787227-e251-43c0-b3c3-6caf4a4bd449	0653ab92-5171-418b-89d2-9e6b60482bbb	250	30.00	15.00	250	30.00	500	15.00	2025-10-11 15:26:22.44077	gm
d4d8211d-5eef-4120-91ee-50b4978fa9f8	96787227-e251-43c0-b3c3-6caf4a4bd449	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	500	80.00	80.00	500	80.00	500	80.00	2025-10-11 15:26:22.44077	gm
10bb9e79-4b2f-414a-8c05-aae59d2f69eb	96787227-e251-43c0-b3c3-6caf4a4bd449	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	75.00	75.00	500	75.00	500	75.00	2025-10-11 15:26:22.44077	gm
64efff67-768d-4009-a9c3-b9e2de73249a	96787227-e251-43c0-b3c3-6caf4a4bd449	c1c3bf43-b581-408e-9317-57d81fa7ae00	500	80.00	80.00	500	80.00	500	80.00	2025-10-11 15:26:22.44077	gm
f8788978-5a92-4d23-89f6-c04fd1a4b306	96787227-e251-43c0-b3c3-6caf4a4bd449	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	20.00	50.00	250	20.00	100	50.00	2025-10-11 15:26:22.44077	gm
a7221ebe-a6a8-4b53-af30-2bbfcaa2dc75	96787227-e251-43c0-b3c3-6caf4a4bd449	de8e800e-c915-4d26-9ff5-94701f51222d	500	40.00	40.00	500	40.00	500	40.00	2025-10-11 15:26:22.44077	gm
682715cb-c045-4f82-b414-7a8d5a54e5e4	96787227-e251-43c0-b3c3-6caf4a4bd449	bd71ec96-c096-496b-9993-b560661cbb48	500	40.00	40.00	500	40.00	500	40.00	2025-10-11 15:26:22.44077	gm
23b9a2ef-2a63-435e-96b4-8c0ce1d37b5c	8fc63278-d986-4bfd-a34c-55556c138522	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	40.00	500	40.00	2025-10-11 16:34:50.382114	gm
799c1874-2b4e-44c8-a412-5218b51fa2ad	8fc63278-d986-4bfd-a34c-55556c138522	c623d1cc-09b3-48ae-96c1-e996053ab84a	100	20.00	20.00	100	20.00	100	20.00	2025-10-11 16:34:50.382114	gm
c3b1b097-b906-4a2b-b638-fd1f9c04bf71	8fc63278-d986-4bfd-a34c-55556c138522	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	40.00	500	40.00	2025-10-11 16:34:50.382114	gm
3bbc2a85-bd36-47a2-91bf-b1bc5c81b9a6	8fc63278-d986-4bfd-a34c-55556c138522	43f5ae1c-ecad-4e22-9825-712dde5d647e	500	60.00	60.00	500	60.00	500	60.00	2025-10-11 16:34:50.382114	gm
d30bc252-78aa-47dd-b071-6f53579682fd	8fc63278-d986-4bfd-a34c-55556c138522	7fded13b-5795-4f23-a8ba-c1c830755b18	250	30.00	15.00	250	30.00	500	15.00	2025-10-11 16:34:50.382114	gm
ea4f324e-c830-49db-bd19-46179a11dcbd	8fc63278-d986-4bfd-a34c-55556c138522	feb933e8-b9cb-4046-978c-f8619c693eb5	500	50.00	50.00	500	50.00	500	50.00	2025-10-11 16:34:50.382114	gm
7c6df940-695d-41eb-9a56-a6acacf1b6eb	8fc63278-d986-4bfd-a34c-55556c138522	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	500	50.00	50.00	500	50.00	500	50.00	2025-10-11 16:34:50.382114	gm
08eac65c-8075-4319-84a7-d30ae4fef3ed	8fc63278-d986-4bfd-a34c-55556c138522	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	80.00	40.00	250	80.00	500	40.00	2025-10-11 16:34:50.382114	gm
56b3b446-633a-418d-b3c7-35b3c84944f5	8fc63278-d986-4bfd-a34c-55556c138522	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-11 16:34:50.382114	gm
b084c51a-3ca8-4560-8670-81c769f720bd	8fc63278-d986-4bfd-a34c-55556c138522	93269f85-eae4-4983-9dfa-6b3620dbcbe6	250	50.00	50.00	250	50.00	250	50.00	2025-10-11 16:34:50.382114	gm
ac6b7404-bb70-405d-a508-e552cbf5ab72	b209c129-4546-4f8b-8afd-2396a4531df1	c623d1cc-09b3-48ae-96c1-e996053ab84a	100	20.00	20.00	100	20.00	100	20.00	2025-10-02 14:35:22.060449	gm
b87fc3b7-3d0e-483d-b0b3-42f0aba00547	b209c129-4546-4f8b-8afd-2396a4531df1	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	30.00	500	30.00	2025-10-02 14:35:22.060449	gm
48ea2b3c-1c5b-4d3d-b8af-0fd7e245bc9f	b209c129-4546-4f8b-8afd-2396a4531df1	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	70.00	35.00	250	70.00	500	35.00	2025-10-02 14:35:22.060449	gm
d0787264-38bf-4080-a173-c86ee1d65474	b209c129-4546-4f8b-8afd-2396a4531df1	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	75.00	37.50	250	75.00	500	37.50	2025-10-02 14:35:22.060449	gm
8f99069f-d302-4ca6-afd7-2c009e1709bb	b209c129-4546-4f8b-8afd-2396a4531df1	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-02 14:35:22.060449	gm
b75cc69d-9ca0-4bed-9b23-79d1c16277ae	45e8c8e7-9202-4401-9e27-05d21c10c092	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	70.00	35.00	250	70.00	500	35.00	2025-10-07 14:36:26.51782	gm
59355eb9-7eb1-43c0-926c-2c772d26f57e	45e8c8e7-9202-4401-9e27-05d21c10c092	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 14:36:26.51782	gm
ac27d3f0-4bf4-4544-873b-abd205109e23	45e8c8e7-9202-4401-9e27-05d21c10c092	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	60.00	30.00	250	60.00	500	30.00	2025-10-07 14:36:26.51782	gm
c0ad43f4-f3fd-4297-8a9a-71e63426ce91	45e8c8e7-9202-4401-9e27-05d21c10c092	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-10-07 14:36:26.51782	pc
0e277f76-b69b-48df-9c81-e17e620d8de0	45e8c8e7-9202-4401-9e27-05d21c10c092	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-07 14:36:26.51782	gm
d639426e-39f8-4d07-bc89-b65016dc845f	d440d474-9a52-42fa-a5a3-a59f2ba46b43	35660cc6-d186-4b87-9c97-3c07bbc5303f	500	25.00	25.00	500	25.00	500	25.00	2025-10-07 15:18:11.241398	gm
59f16357-54e3-4021-8ffd-76cea67538b3	66c3f6e3-dde1-46ea-9c1a-f9ac4ef32f1a	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-11 15:27:13.095189	gm
929292b4-d24e-406b-801b-59dda27adf70	66c3f6e3-dde1-46ea-9c1a-f9ac4ef32f1a	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	30.00	500	30.00	2025-10-11 15:27:13.095189	gm
f3bc50e3-8a35-449a-b6c1-883dd69904a0	66c3f6e3-dde1-46ea-9c1a-f9ac4ef32f1a	69a3bbb1-2538-40c2-8a1a-c5dc78485bb3	250	50.00	25.00	250	50.00	500	25.00	2025-10-11 15:27:13.095189	gm
2f474b5b-0cb7-450e-9522-7bd6cc7f554b	7ea57b31-b69d-40bf-9294-f3b41f1d3bcb	c623d1cc-09b3-48ae-96c1-e996053ab84a	100	20.00	20.00	100	20.00	100	20.00	2025-10-02 14:37:48.691714	gm
c303bc68-4d98-4411-9f62-16d2adbbd8e6	7ea57b31-b69d-40bf-9294-f3b41f1d3bcb	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-10-02 14:37:48.691714	pc
1934c959-f60a-4067-8c61-8fb215b8d934	7ea57b31-b69d-40bf-9294-f3b41f1d3bcb	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	30.00	500	30.00	2025-10-02 14:37:48.691714	gm
6526e5bd-a4c7-49cc-b2fa-243be4364d4a	7ea57b31-b69d-40bf-9294-f3b41f1d3bcb	81ee7d10-3404-4ae2-b740-8acf875e3ba2	300	60.00	36.00	300	60.00	500	36.00	2025-10-02 14:37:48.691714	gm
6d0b3df0-aef3-41f9-a09a-2b46c4bb418c	7ea57b31-b69d-40bf-9294-f3b41f1d3bcb	371c3ff4-639a-46a2-8103-95906e93fb5e	250	50.00	25.00	250	50.00	500	25.00	2025-10-02 14:37:48.691714	gm
6d9e944f-bcd2-4957-b556-56a1406df56c	8cbcac26-c690-4f3c-9494-b926a4b3f560	371c3ff4-639a-46a2-8103-95906e93fb5e	250	50.00	25.00	250	50.00	500	25.00	2025-10-07 15:20:26.666156	gm
e248e16f-7329-48f3-bc25-3ca2c7b419d3	8cbcac26-c690-4f3c-9494-b926a4b3f560	371c3ff4-639a-46a2-8103-95906e93fb5e	250	50.00	25.00	250	50.00	500	25.00	2025-10-07 15:20:26.666156	gm
ef37ca2f-2b40-4554-94a7-7759012594df	8cbcac26-c690-4f3c-9494-b926a4b3f560	c623d1cc-09b3-48ae-96c1-e996053ab84a	100	20.00	20.00	100	20.00	100	20.00	2025-10-07 15:20:26.666156	gm
134ec6eb-e186-421a-a4a1-ab702dd84201	8cbcac26-c690-4f3c-9494-b926a4b3f560	c623d1cc-09b3-48ae-96c1-e996053ab84a	100	20.00	20.00	100	20.00	100	20.00	2025-10-07 15:20:26.666156	gm
9b74026a-aff6-4aa0-b78d-cfde703a5013	8cbcac26-c690-4f3c-9494-b926a4b3f560	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 15:20:26.666156	gm
7392dd5a-3820-444c-9056-b27c5ebb93ea	8cbcac26-c690-4f3c-9494-b926a4b3f560	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-10-07 15:20:26.666156	pc
eb3026b4-11de-4088-acf6-72e65a29d932	8cbcac26-c690-4f3c-9494-b926a4b3f560	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	60.00	30.00	250	60.00	500	30.00	2025-10-07 15:20:26.666156	gm
55c6472a-f830-4aae-a5c1-60647922d4ef	8cbcac26-c690-4f3c-9494-b926a4b3f560	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	60.00	30.00	250	60.00	500	30.00	2025-10-07 15:20:26.666156	gm
8e2563dd-df37-4789-a407-76ed57382520	8cbcac26-c690-4f3c-9494-b926a4b3f560	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	250	15.00	37.50	250	15.00	100	37.50	2025-10-07 15:20:26.666156	gm
76c66c83-7aa3-4684-bdf2-55fa59d3267c	8cbcac26-c690-4f3c-9494-b926a4b3f560	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	15.00	100	15.00	2025-10-07 15:20:26.666156	gm
96f41f6b-2df6-4b73-9048-3d17332b2d8f	8cbcac26-c690-4f3c-9494-b926a4b3f560	738a0900-9798-424c-a3f6-04a98bcf3848	2	30.00	60.00	2	30.00	1000	60.00	2025-10-07 15:20:26.666156	kg
2b9f1fc3-d0a3-426b-9c9e-58fed74f3901	8cbcac26-c690-4f3c-9494-b926a4b3f560	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-07 15:20:26.666156	gm
f362e3da-44ef-4161-b539-c477b402e692	8cbcac26-c690-4f3c-9494-b926a4b3f560	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 15:20:26.666156	gm
36abab78-da9c-4b8c-826b-60d737c47c2d	db9de674-ca7c-4c73-bdfb-4016fedf1ee2	738a0900-9798-424c-a3f6-04a98bcf3848	2	35.00	70.00	2	35.00	1000	70.00	2025-10-11 15:28:27.60014	kg
e3be7639-7704-4b85-ae00-5b39372ca48b	db9de674-ca7c-4c73-bdfb-4016fedf1ee2	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-11 15:28:27.60014	pc
0395ac7e-0a04-403b-afdc-547e4dc8b4a4	db9de674-ca7c-4c73-bdfb-4016fedf1ee2	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-10-11 15:28:27.60014	pc
b1c5e4f4-acd0-4139-bb62-9e8438adfd48	a7ccb826-10b8-405c-92b5-58137f852971	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	70.00	35.00	250	70.00	500	35.00	2025-09-27 14:30:05.635264	gm
e6eb4d55-d5a3-4fd4-b5be-cd042e70d4f5	a7ccb826-10b8-405c-92b5-58137f852971	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	50.00	25.00	250	50.00	500	25.00	2025-09-27 14:30:05.635264	gm
5b3aee7e-9a26-4423-9054-7507ff2e2cab	a7ccb826-10b8-405c-92b5-58137f852971	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-09-27 14:30:05.635264	pc
c8226843-ba27-479c-8a65-5cc92547d642	a7ccb826-10b8-405c-92b5-58137f852971	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-09-27 14:30:05.635264	gm
6e8ba1a5-5115-4979-8588-339dbe6bda94	a7ccb826-10b8-405c-92b5-58137f852971	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	40.00	20.00	250	40.00	500	20.00	2025-09-27 14:30:05.635264	gm
a75956ae-230f-4a2b-9352-558333f8276b	a7ccb826-10b8-405c-92b5-58137f852971	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	50.00	500	50.00	2025-09-27 14:30:05.635264	gm
a3b3a859-b727-4fa2-9b0c-099c0528adda	a7ccb826-10b8-405c-92b5-58137f852971	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-09-27 14:30:05.635264	gm
b9828af1-3afc-4f50-97f6-51074e3a7664	5d4312e3-f06a-4eeb-8146-7f5c735ad052	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-02 14:38:25.144647	gm
e7068729-12bc-4932-a79b-dbb9b8cf6c46	5d4312e3-f06a-4eeb-8146-7f5c735ad052	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-10-02 14:38:25.144647	gm
7f1303b4-b3f3-425a-9a92-d85b25747af6	c3c2171f-a12d-4eb2-b573-78790cacc8dd	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-10-11 15:32:15.103501	pc
cd133c12-90b7-4b03-a6ce-a012cb59f423	c3c2171f-a12d-4eb2-b573-78790cacc8dd	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	70.00	70.00	500	70.00	500	70.00	2025-10-11 15:32:15.103501	gm
f3f5d4ac-eb0f-40b8-8316-a6038aa3f25a	c3c2171f-a12d-4eb2-b573-78790cacc8dd	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	1	40.00	80.00	1	40.00	500	80.00	2025-10-11 15:32:15.103501	kg
3439d74b-87bb-4395-8507-4c177b97774a	c3c2171f-a12d-4eb2-b573-78790cacc8dd	bd71ec96-c096-496b-9993-b560661cbb48	1	40.00	80.00	1	40.00	500	80.00	2025-10-11 15:32:15.103501	kg
13fa5b12-a28d-466c-8d40-a23255f30ebf	c3c2171f-a12d-4eb2-b573-78790cacc8dd	97d66b60-b3da-41f0-a6b0-305cbb2fb464	1	35.00	70.00	1	35.00	500	70.00	2025-10-11 15:32:15.103501	kg
7dfe5a03-6bd1-4e7c-bd2b-afcd546ab312	69e50dc5-d6d9-43c7-b72d-39e653a09ee4	371c3ff4-639a-46a2-8103-95906e93fb5e	250	40.00	20.00	250	40.00	500	20.00	2025-09-27 14:32:21.681507	gm
d82edc87-5ebc-4368-8792-593c343b8860	69e50dc5-d6d9-43c7-b72d-39e653a09ee4	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	50.00	500	50.00	2025-09-27 14:32:21.681507	gm
c5d506e2-90cc-4558-b63b-2e023ff9e0fe	69e50dc5-d6d9-43c7-b72d-39e653a09ee4	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	30.00	15.00	250	30.00	500	15.00	2025-09-27 14:32:21.681507	gm
16b2d60a-2f95-459a-b861-108b6d17db1f	69e50dc5-d6d9-43c7-b72d-39e653a09ee4	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-09-27 14:32:21.681507	pc
cdcf59fa-6216-48f1-b935-e03396601024	69e50dc5-d6d9-43c7-b72d-39e653a09ee4	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	50.00	25.00	250	50.00	500	25.00	2025-09-27 14:32:21.681507	gm
bbf90327-5d7c-4ab4-971d-206ffcfcef41	69e50dc5-d6d9-43c7-b72d-39e653a09ee4	0653ab92-5171-418b-89d2-9e6b60482bbb	250	30.00	15.00	250	30.00	500	15.00	2025-09-27 14:32:21.681507	gm
9c7f374d-48b7-4903-b03e-04ca864079a9	69e50dc5-d6d9-43c7-b72d-39e653a09ee4	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	15.00	37.50	250	15.00	100	37.50	2025-09-27 14:32:21.681507	gm
a07075ce-965f-4576-8b4f-8a37758cb6f8	71399bb7-ff2c-4717-9720-485ed4a475fd	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-07 14:43:30.840137	gm
d3d048d8-0d26-4373-9fcc-c0f7f1139f79	71399bb7-ff2c-4717-9720-485ed4a475fd	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 14:43:30.840137	gm
63c3ff6f-2fd5-4753-acfe-d6c24216c86c	71399bb7-ff2c-4717-9720-485ed4a475fd	7fded13b-5795-4f23-a8ba-c1c830755b18	150	30.00	9.00	150	30.00	500	9.00	2025-10-07 14:43:30.840137	gm
6720c34f-3769-4c3d-82c7-6a6554282ebf	71399bb7-ff2c-4717-9720-485ed4a475fd	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-07 14:43:30.840137	gm
f2182a4b-e324-43a8-94d6-78d5145ed754	71399bb7-ff2c-4717-9720-485ed4a475fd	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	70.00	35.00	250	70.00	500	35.00	2025-10-07 14:43:30.840137	gm
ea78b954-8f95-46a6-a53f-18da8ac875fd	3ecbf90c-f02e-4698-9c4b-807886106935	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	30.00	500	30.00	2025-10-11 15:33:00.68198	gm
d07530c9-9ee1-4453-9edc-60f976b2509b	3ecbf90c-f02e-4698-9c4b-807886106935	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-10-11 15:33:00.68198	pc
ae9dd779-d27a-4cc3-80bb-34ff17d30d0e	52bf724f-7b8d-409b-9aa5-b9b2a9d1ce62	43f5ae1c-ecad-4e22-9825-712dde5d647e	500	40.00	40.00	500	40.00	500	40.00	2025-09-27 14:33:16.949196	gm
98d5f798-339b-4619-866f-0e761e31c2a3	52bf724f-7b8d-409b-9aa5-b9b2a9d1ce62	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-09-27 14:33:16.949196	gm
43471e20-cc34-43e5-a1a6-06bbb7a82a9e	52bf724f-7b8d-409b-9aa5-b9b2a9d1ce62	738a0900-9798-424c-a3f6-04a98bcf3848	2	30.00	60.00	2	30.00	1000	60.00	2025-09-27 14:33:16.949196	kg
7fd8a59d-d57f-4ad0-9377-6e2dc2b5978d	52bf724f-7b8d-409b-9aa5-b9b2a9d1ce62	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	60.00	30.00	250	60.00	500	30.00	2025-09-27 14:33:16.949196	gm
6a2e1c41-23e9-415c-ab99-cbcfbe5cf9fc	372f78c5-11d7-45c5-a84c-8936df48f115	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-02 14:17:13.479332	gm
79af73e0-712a-4e20-8cc2-8c52e5a5756e	372f78c5-11d7-45c5-a84c-8936df48f115	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-10-02 14:17:13.479332	gm
97966645-dc0a-4074-bc8b-6457381b4ae2	c6b6ed68-73a9-4a05-b85a-7767eafd1ac9	371c3ff4-639a-46a2-8103-95906e93fb5e	500	50.00	50.00	500	50.00	500	50.00	2025-10-02 15:04:03.376231	gm
3373ed22-5e86-4433-b4f1-a9ac36f2caf0	c6b6ed68-73a9-4a05-b85a-7767eafd1ac9	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-10-02 15:04:03.376231	pc
c4f93199-1868-4db3-85d5-9d9ebb2a5a0a	c6b6ed68-73a9-4a05-b85a-7767eafd1ac9	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-02 15:04:03.376231	pc
3711aad9-f3f9-4582-8b8d-2c0dcc1e62b9	c6b6ed68-73a9-4a05-b85a-7767eafd1ac9	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	1	30.00	60.00	1	30.00	500	60.00	2025-10-02 15:04:03.376231	kg
a467a249-e2dd-4752-bf19-efbfdbb04e90	c6b6ed68-73a9-4a05-b85a-7767eafd1ac9	738a0900-9798-424c-a3f6-04a98bcf3848	2	30.00	60.00	2	30.00	1000	60.00	2025-10-02 15:04:03.376231	kg
7fd55a7a-2698-4bca-8fdb-0a2602e1dda3	c6b6ed68-73a9-4a05-b85a-7767eafd1ac9	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	25.00	12.50	250	25.00	500	12.50	2025-10-02 15:04:03.376231	gm
bf21ba64-cc3b-4273-b4e4-25680dbc7af0	c6b6ed68-73a9-4a05-b85a-7767eafd1ac9	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	70.00	70.00	500	70.00	500	70.00	2025-10-02 15:04:03.376231	gm
fb9289de-905c-4010-9302-f84724dfa390	c6b6ed68-73a9-4a05-b85a-7767eafd1ac9	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	50.00	500	50.00	2025-10-02 15:04:03.376231	gm
0be22b09-fd12-468d-ae9b-7a816e1b8d76	c6b6ed68-73a9-4a05-b85a-7767eafd1ac9	2eae0636-1fa4-4d47-855f-306125787b1e	500	25.00	50.00	500	25.00	250	50.00	2025-10-02 15:04:03.376231	gm
bb005bcf-5ae7-4f01-8d57-646ea2bce9b6	c6b6ed68-73a9-4a05-b85a-7767eafd1ac9	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	700	70.00	98.00	700	70.00	500	98.00	2025-10-02 15:04:03.376231	gm
fcf4422e-4427-4027-8d21-c24639863d8a	c6b6ed68-73a9-4a05-b85a-7767eafd1ac9	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	15.00	100	15.00	2025-10-02 15:04:03.376231	gm
fb1c1b15-ca60-4aeb-99ca-0bf88e4adacd	c6b6ed68-73a9-4a05-b85a-7767eafd1ac9	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	500	20.00	100.00	500	20.00	100	100.00	2025-10-02 15:04:03.376231	gm
9e6efce1-a2fd-4041-97d1-46269dca5c3a	bb3a8984-bb6f-4ec4-af86-02722198ef57	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-07 14:44:17.295939	gm
de2bf179-c5ed-41fe-b5c2-60ef44c7f9bc	bb3a8984-bb6f-4ec4-af86-02722198ef57	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	30.00	15.00	250	30.00	500	15.00	2025-10-07 14:44:17.295939	gm
ddaae449-42d9-4c3d-b4b5-563880b18260	bb3a8984-bb6f-4ec4-af86-02722198ef57	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-10-07 14:44:17.295939	kg
00546994-70d8-4e7c-8bea-ad9b4429047d	bb3a8984-bb6f-4ec4-af86-02722198ef57	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-07 14:44:17.295939	pc
056d342b-c9eb-4273-bdb8-0bb99ea5f049	9c19c94a-d2dd-4496-a410-4941d518e4e7	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-09-27 14:33:44.612853	pc
5d46c5ce-c12c-452b-ac0f-ca340566b169	9c19c94a-d2dd-4496-a410-4941d518e4e7	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	250	15.00	37.50	250	15.00	100	37.50	2025-09-27 14:33:44.612853	gm
6aad093e-c9fb-4d19-ab39-4314a7c2d2db	8db9e2e9-e65d-4fb0-bd96-ad5c1f7a9ec7	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-02 14:18:36.109418	gm
a26ddf92-6111-41a4-b035-3bbad3f8937a	8db9e2e9-e65d-4fb0-bd96-ad5c1f7a9ec7	de8e800e-c915-4d26-9ff5-94701f51222d	250	30.00	15.00	250	30.00	500	15.00	2025-10-02 14:18:36.109418	gm
045eaa21-a635-452a-8261-74cffcba719e	8db9e2e9-e65d-4fb0-bd96-ad5c1f7a9ec7	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	15.00	100	15.00	2025-10-02 14:18:36.109418	gm
28e12a8a-cec9-4a83-b37e-d4e149bc1292	8db9e2e9-e65d-4fb0-bd96-ad5c1f7a9ec7	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-10-02 14:18:36.109418	kg
135c39ac-da8d-44d3-b53a-026bd9f969fb	8db9e2e9-e65d-4fb0-bd96-ad5c1f7a9ec7	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-02 14:18:36.109418	gm
15632160-a004-4712-9528-50a682312ca2	8db9e2e9-e65d-4fb0-bd96-ad5c1f7a9ec7	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	70.00	35.00	250	70.00	500	35.00	2025-10-02 14:18:36.109418	gm
a496ba3b-2ab9-4e54-b3c6-8554b1ad6a8b	8db9e2e9-e65d-4fb0-bd96-ad5c1f7a9ec7	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	50.00	500	50.00	2025-10-02 14:18:36.109418	gm
18c570ca-e636-4224-bc65-c95b56b3f836	5517851a-b365-4e7e-89bf-89c39993cba0	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-02 15:30:08.137806	pc
66a3a971-5a7a-422a-a3bf-34537c15baf6	5517851a-b365-4e7e-89bf-89c39993cba0	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	30.00	500	30.00	2025-10-02 15:30:08.137806	gm
252b1a2c-758e-4f31-bf92-d665d22558d3	12ae5df3-5f5e-4feb-9a6b-067882c959d7	738a0900-9798-424c-a3f6-04a98bcf3848	2	30.00	60.00	2	30.00	1000	60.00	2025-10-07 14:45:53.88869	kg
55380714-9132-4041-8b93-0b2f46ac15b2	12ae5df3-5f5e-4feb-9a6b-067882c959d7	de8e800e-c915-4d26-9ff5-94701f51222d	700	30.00	42.00	700	30.00	500	42.00	2025-10-07 14:45:53.88869	gm
bb49c56b-1fbd-4d69-86bd-9297475a7176	12ae5df3-5f5e-4feb-9a6b-067882c959d7	371c3ff4-639a-46a2-8103-95906e93fb5e	300	50.00	30.00	300	50.00	500	30.00	2025-10-07 14:45:53.88869	gm
b2cf4d26-d368-4612-ac02-58a18b1db7aa	12ae5df3-5f5e-4feb-9a6b-067882c959d7	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 14:45:53.88869	gm
927cd524-e87f-4969-ab74-0418d3fae9e0	12ae5df3-5f5e-4feb-9a6b-067882c959d7	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	60.00	30.00	250	60.00	500	30.00	2025-10-07 14:45:53.88869	gm
31f57ed1-0014-403a-9571-1af047dca48d	12ae5df3-5f5e-4feb-9a6b-067882c959d7	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-07 14:45:53.88869	pc
8ce183b3-6c60-45d8-b58b-eb97fb880bd2	12ae5df3-5f5e-4feb-9a6b-067882c959d7	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	75.00	37.50	250	75.00	500	37.50	2025-10-07 14:45:53.88869	gm
b03d63a1-131d-480d-901b-4e106518fe23	12ae5df3-5f5e-4feb-9a6b-067882c959d7	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	300	70.00	42.00	300	70.00	500	42.00	2025-10-07 14:45:53.88869	gm
40469011-829b-47f2-b49e-ee9c1a8f9350	feab869d-5299-4c93-ba3d-cbb76c72f72f	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	30.00	500	30.00	2025-10-11 15:35:43.581789	gm
13d83136-4036-4266-b7a0-5b59d811c70c	feab869d-5299-4c93-ba3d-cbb76c72f72f	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-11 15:35:43.581789	gm
bc844eba-de7b-4b58-b04d-cc040fa58bfe	feab869d-5299-4c93-ba3d-cbb76c72f72f	7fded13b-5795-4f23-a8ba-c1c830755b18	250	30.00	15.00	250	30.00	500	15.00	2025-10-11 15:35:43.581789	gm
0c4217d9-61de-43d2-949f-bf1ce88a494c	feab869d-5299-4c93-ba3d-cbb76c72f72f	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-11 15:35:43.581789	pc
3b8c978b-a520-4f99-a3a5-dcabb75ea0d5	feab869d-5299-4c93-ba3d-cbb76c72f72f	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	40.00	20.00	250	40.00	500	20.00	2025-10-11 15:35:43.581789	gm
94ad35a6-f707-42b9-ac6e-24b612c1b780	feab869d-5299-4c93-ba3d-cbb76c72f72f	de8e800e-c915-4d26-9ff5-94701f51222d	500	40.00	40.00	500	40.00	500	40.00	2025-10-11 15:35:43.581789	gm
a1ffa94e-0c87-44c7-84b5-56fcfe8707d0	ef339ec2-29a4-4846-b6da-67e7f4e71ef2	feb933e8-b9cb-4046-978c-f8619c693eb5	500	50.00	50.00	500	50.00	500	50.00	2025-09-27 14:34:14.707439	gm
d099b31c-bb6a-42e4-a8be-76534536cf0d	ef339ec2-29a4-4846-b6da-67e7f4e71ef2	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	15.00	100	15.00	2025-09-27 14:34:14.707439	gm
f77f7bdf-b44f-4c10-a778-e868c213bc9f	ef339ec2-29a4-4846-b6da-67e7f4e71ef2	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	70.00	35.00	250	70.00	500	35.00	2025-09-27 14:34:14.707439	gm
f5530fe9-a3c8-4541-95f7-dfd73116c791	ef339ec2-29a4-4846-b6da-67e7f4e71ef2	97d66b60-b3da-41f0-a6b0-305cbb2fb464	250	35.00	17.50	250	35.00	500	17.50	2025-09-27 14:34:14.707439	gm
f087e091-8ed4-45c6-b8c3-9ed621ede9ee	558f7473-9ab1-41fa-8dc6-ddc0a8d28a6c	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	60.00	30.00	250	60.00	500	30.00	2025-10-02 14:19:44.483787	gm
549952fd-4c16-4536-abbe-e928d4dd999a	558f7473-9ab1-41fa-8dc6-ddc0a8d28a6c	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-02 14:19:44.483787	gm
e7eac65b-160a-460a-8894-e178fd5ae827	558f7473-9ab1-41fa-8dc6-ddc0a8d28a6c	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	30.00	500	30.00	2025-10-02 14:19:44.483787	gm
84b00700-aade-404d-9ee1-6c52c20a8094	558f7473-9ab1-41fa-8dc6-ddc0a8d28a6c	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-10-02 14:19:44.483787	gm
62397a20-9d8b-4475-821d-ff6950e82552	7b130de8-aff2-4c38-bf13-08a51e612847	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-10-07 14:46:53.246499	kg
5038b18e-ce4c-4ee3-b778-5baa2dbb353a	7b130de8-aff2-4c38-bf13-08a51e612847	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	15.00	100	15.00	2025-10-07 14:46:53.246499	gm
3edaae6b-8e1c-42d8-9736-c81facba8ee9	7b130de8-aff2-4c38-bf13-08a51e612847	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	250	25.00	12.50	250	25.00	500	12.50	2025-10-07 14:46:53.246499	gm
d5a6fdc8-dcde-4f2a-8096-ebac51752b97	7b130de8-aff2-4c38-bf13-08a51e612847	0653ab92-5171-418b-89d2-9e6b60482bbb	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 14:46:53.246499	gm
e5b88b25-c812-450a-9ce8-1fbdd21a929b	7b130de8-aff2-4c38-bf13-08a51e612847	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	70.00	35.00	250	70.00	500	35.00	2025-10-07 14:46:53.246499	gm
0381ac4e-4017-47d3-9947-a107d49d5320	7b130de8-aff2-4c38-bf13-08a51e612847	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	60.00	30.00	250	60.00	500	30.00	2025-10-07 14:46:53.246499	gm
0c886ffc-42da-4cad-8ac7-5934bac4ce1f	7b130de8-aff2-4c38-bf13-08a51e612847	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	25.00	250	25.00	2025-10-07 14:46:53.246499	gm
0cce0a9d-9df8-448a-acdc-df24c32f03a6	7b130de8-aff2-4c38-bf13-08a51e612847	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 14:46:53.246499	gm
95c0d282-29f1-4be2-8811-cbd317e818ef	949670cd-e1fd-4574-85f6-589d45f2ef13	97d66b60-b3da-41f0-a6b0-305cbb2fb464	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:06.705	kg
49c8d519-2e76-4f40-9664-8a66ec2ece87	949670cd-e1fd-4574-85f6-589d45f2ef13	7687b526-7d4f-40e5-b274-c66cca337009	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:06.706	gm
79833f49-7d51-4a9c-9775-0eb1955cd7e1	949670cd-e1fd-4574-85f6-589d45f2ef13	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:06.707	gm
13a883ac-72a4-4bd3-811b-b2a861b2d871	9b31ecd2-7f9e-4dae-952d-8494a013d6a2	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.728	gm
f80cd84b-1004-4d45-b597-aab4b93fb5ff	9b31ecd2-7f9e-4dae-952d-8494a013d6a2	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.73	gm
1ce194ce-758e-47c9-92ce-e0c9070ba396	9b31ecd2-7f9e-4dae-952d-8494a013d6a2	0653ab92-5171-418b-89d2-9e6b60482bbb	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.731	gm
79a733e0-f8a9-482e-af70-dfa306ed0281	9b31ecd2-7f9e-4dae-952d-8494a013d6a2	738a0900-9798-424c-a3f6-04a98bcf3848	2	70.00	0.14	2	70.00	1000	0.14	2025-09-27 15:42:06.732	kg
0a7f556b-6822-4201-9d29-2a72ed8cc695	9b31ecd2-7f9e-4dae-952d-8494a013d6a2	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:06.732	pc
09187c76-862f-4180-a6cf-394f4e6244ac	d3b32083-a4c4-4c3e-be3f-bde9ffeb4457	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.753	gm
51583876-d151-4532-8a5e-aeeebfbc8d35	d3b32083-a4c4-4c3e-be3f-bde9ffeb4457	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.756	gm
e71a0d43-9a44-4fec-af6d-9c3a3e55aada	d3b32083-a4c4-4c3e-be3f-bde9ffeb4457	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:06.757	pc
8b7ef04a-4772-4de7-af01-df6beacc7afc	4cb656cd-e2a4-49db-a44c-33f20330581f	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.78	gm
11b5308b-8cd0-47e0-b6c0-e29c039d4a51	4cb656cd-e2a4-49db-a44c-33f20330581f	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:06.782	gm
f60abd08-2ce0-436a-a9f3-16b8390fee88	4cb656cd-e2a4-49db-a44c-33f20330581f	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.783	gm
ca6d1b5a-2fa4-4557-96c6-c606f69ec073	4cb656cd-e2a4-49db-a44c-33f20330581f	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:06.784	gm
81416652-fe2b-4d79-9ac0-6bc92006067b	4cb656cd-e2a4-49db-a44c-33f20330581f	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:06.785	gm
e990fe4b-f6fa-42d2-8469-9cf479204b29	765d40cd-69de-49da-bc91-8d03710f95c8	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	70.00	70.00	1	70.00	1000	70.00	2025-09-27 15:42:06.806	kg
ce40ab02-0719-41a4-bdee-d12f8d1f154d	765d40cd-69de-49da-bc91-8d03710f95c8	be7965d2-e7ae-42dd-9731-b1195135005e	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:06.809	kg
0e9638e8-f6dd-4a77-be90-a6e98ed6d3d2	765d40cd-69de-49da-bc91-8d03710f95c8	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:06.81	gm
ec366702-c337-4471-a404-4a70c1d1421d	aa11d899-090d-4a7c-8c5e-4101d0358643	6c1e3d72-7d97-40bb-97b4-93059631140f	4	60.00	60.00	4	15.00	1	60.00	2025-09-27 15:42:06.834	pc
d668d85b-132e-4107-8712-6581d6e4043a	6f1aa894-2ae8-4850-ba0a-9a65851b177d	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:06.857	gm
d7755a6e-47a6-46fb-9848-56941d9544a8	6f1aa894-2ae8-4850-ba0a-9a65851b177d	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.86	gm
93265539-3b3d-4654-b7e3-7835fbb2a0d4	6f1aa894-2ae8-4850-ba0a-9a65851b177d	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:06.861	pc
8f7817f6-4d48-49ff-8411-cdf5e802817a	6f1aa894-2ae8-4850-ba0a-9a65851b177d	cba9a138-b913-47df-b1fa-61663c7603b0	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:06.863	kg
538ec408-3cee-4638-8219-4b2159c5e0be	6f1aa894-2ae8-4850-ba0a-9a65851b177d	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.863	gm
1853fa5d-ab58-4652-ad4f-92a07da767d3	2da2fbc5-f2a1-4273-8ac3-3960793e95ec	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:06.886	gm
b435178b-9cfc-4ea2-8781-65ef2945ed6f	2da2fbc5-f2a1-4273-8ac3-3960793e95ec	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:06.888	gm
7da9cdd5-6f82-41f6-8c82-280eb66078b1	2da2fbc5-f2a1-4273-8ac3-3960793e95ec	cba9a138-b913-47df-b1fa-61663c7603b0	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:06.89	kg
cfda885d-f180-4370-a82b-c89f46482c7e	db20bc23-558f-4d4e-ab3a-7276c493972e	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:06.909	gm
8609af93-2d2c-4dde-a622-75d2e0f2563a	db20bc23-558f-4d4e-ab3a-7276c493972e	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:06.912	pc
8169f9fa-84f1-40a7-82ac-bcecfefdbd52	db20bc23-558f-4d4e-ab3a-7276c493972e	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.913	gm
59ea2b88-5f38-4ad7-9f41-a0ec0f56c73a	db20bc23-558f-4d4e-ab3a-7276c493972e	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:06.914	gm
842f1a3a-d9ea-4d3a-b5bd-fd035164a900	a3d1b5f2-8780-488d-8f16-f2df4a7e7173	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.936	gm
5f4af24c-4922-4a49-a37b-0bd922214821	a3d1b5f2-8780-488d-8f16-f2df4a7e7173	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:06.939	pc
adbedfdf-1101-46ab-85c2-49b307e20e59	a3d1b5f2-8780-488d-8f16-f2df4a7e7173	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:06.94	gm
083f5a8a-0f38-47c9-a49b-08a19725625c	a3d1b5f2-8780-488d-8f16-f2df4a7e7173	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:06.941	gm
c1bec00d-aa35-42c9-b88e-525d359e1f52	a3d1b5f2-8780-488d-8f16-f2df4a7e7173	cba9a138-b913-47df-b1fa-61663c7603b0	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:06.942	gm
188932ef-c4d1-4b01-a83f-12769349d38b	858e19b9-f6df-4e61-8828-bb18b7967f59	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:06.961	pc
ba40569d-7f06-4f15-92da-9961205ad997	858e19b9-f6df-4e61-8828-bb18b7967f59	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.963	gm
a206c848-facc-481d-8509-ed4102590bd6	858e19b9-f6df-4e61-8828-bb18b7967f59	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.965	gm
1d49cce1-7fe0-4666-810e-7348b41c6040	e342bd71-4bb2-469f-9b4e-f07cd0e14d40	97d66b60-b3da-41f0-a6b0-305cbb2fb464	750	60.00	60.00	750	80.00	1000	60.00	2025-09-27 15:42:06.985	gm
27a0437f-2878-41d9-9c8b-e1c3b782021c	e342bd71-4bb2-469f-9b4e-f07cd0e14d40	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.987	gm
b81e3b8c-1af2-4807-85ac-195edb1d6413	e342bd71-4bb2-469f-9b4e-f07cd0e14d40	738a0900-9798-424c-a3f6-04a98bcf3848	1	35.00	0.04	1	35.00	1000	0.04	2025-09-27 15:42:06.988	kg
971c70ce-dc81-42ff-8de0-868cbc431f81	e342bd71-4bb2-469f-9b4e-f07cd0e14d40	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	60.00	60.00	500	120.00	1000	60.00	2025-09-27 15:42:06.989	gm
7eae03ac-9f68-42ed-aa75-8dff26071c06	e342bd71-4bb2-469f-9b4e-f07cd0e14d40	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.989	gm
bc4d247f-bfd4-475c-b05e-5cea8736ae8c	4c655e8f-b82c-4a24-943b-286255ffc0d1	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.01	gm
b650bad4-053c-490b-9017-b85cae9f0265	4c655e8f-b82c-4a24-943b-286255ffc0d1	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:07.011	gm
be10c01f-de33-401c-862d-13a058856cbe	4c655e8f-b82c-4a24-943b-286255ffc0d1	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:07.012	gm
f757032c-ace4-47a3-a99d-385443b8e31e	4c655e8f-b82c-4a24-943b-286255ffc0d1	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:07.012	gm
a575e97f-efd8-4a11-8f1d-c7eee5514f26	4c655e8f-b82c-4a24-943b-286255ffc0d1	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:07.013	gm
3deefa4a-c3c8-41c1-a726-38f0e91b7ad3	4c655e8f-b82c-4a24-943b-286255ffc0d1	738a0900-9798-424c-a3f6-04a98bcf3848	1	35.00	0.04	1	35.00	1000	0.04	2025-09-27 15:42:07.013	kg
ca4ca472-b04c-4892-99a5-15fc142bcaea	4c655e8f-b82c-4a24-943b-286255ffc0d1	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:07.014	gm
6d991b21-32ea-43d3-92b8-9cbe1bdfe8e5	4c655e8f-b82c-4a24-943b-286255ffc0d1	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:07.014	gm
efd16211-8eda-43cb-b04b-c0224472f2ca	4c655e8f-b82c-4a24-943b-286255ffc0d1	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:07.016	pc
1cb3adeb-6996-42a8-9268-db42e1be503e	4c655e8f-b82c-4a24-943b-286255ffc0d1	cba9a138-b913-47df-b1fa-61663c7603b0	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.017	gm
b40689a7-31f1-4ee1-a9cf-f45ff4130929	0777ffa9-5e77-4dfd-8e92-45e27bfd0c95	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-09-27 14:35:58.925397	pc
7cc7d4fb-f17b-4d31-8d5a-f56edc31134c	0777ffa9-5e77-4dfd-8e92-45e27bfd0c95	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-09-27 14:35:58.925397	pc
c85761b9-1609-40be-8273-08fa8b097e33	0777ffa9-5e77-4dfd-8e92-45e27bfd0c95	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	30.00	500	30.00	2025-09-27 14:35:58.925397	gm
253fc3a7-058a-499d-9be2-7e9a168f6517	0777ffa9-5e77-4dfd-8e92-45e27bfd0c95	cba9a138-b913-47df-b1fa-61663c7603b0	1	30.00	60.00	1	30.00	500	60.00	2025-09-27 14:35:58.925397	kg
dadd6fd1-96f9-4d96-9e2d-6406c5e71838	0777ffa9-5e77-4dfd-8e92-45e27bfd0c95	6c1e3d72-7d97-40bb-97b4-93059631140f	4	15.00	60.00	4	15.00	1	60.00	2025-09-27 14:35:58.925397	pc
4b746636-9d68-446a-8fda-f100d716eb15	0777ffa9-5e77-4dfd-8e92-45e27bfd0c95	2eae0636-1fa4-4d47-855f-306125787b1e	500	25.00	50.00	500	25.00	250	50.00	2025-09-27 14:35:58.925397	gm
7d9ea7a6-761d-4920-b66a-2efdf7bf551c	0777ffa9-5e77-4dfd-8e92-45e27bfd0c95	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-09-27 14:35:58.925397	gm
6febe1c9-6509-47c7-bdab-0806a4b6f034	0777ffa9-5e77-4dfd-8e92-45e27bfd0c95	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	300	15.00	45.00	300	15.00	100	45.00	2025-09-27 14:35:58.925397	gm
e6e1ffb1-7111-41cd-a704-bebe63f916a4	0777ffa9-5e77-4dfd-8e92-45e27bfd0c95	371c3ff4-639a-46a2-8103-95906e93fb5e	250	40.00	20.00	250	40.00	500	20.00	2025-09-27 14:35:58.925397	gm
aca0bd1e-c2c9-4e0c-a170-720dc818c42a	4c655e8f-b82c-4a24-943b-286255ffc0d1	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:07.017	gm
81aa8d0e-0f57-4c37-80dc-0172581c88a5	4c655e8f-b82c-4a24-943b-286255ffc0d1	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:07.018	gm
ba66cdd6-bdf2-4044-aca4-7403dc461c15	ffa545d4-ea0e-4d9e-ab86-75c9e41ac5e6	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	200	30.00	30.00	200	150.00	1000	30.00	2025-09-27 15:42:07.114	gm
058a755c-e558-4f84-835a-f885e90b0151	ffa545d4-ea0e-4d9e-ab86-75c9e41ac5e6	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:07.116	gm
a1224350-ca71-4f37-a6a5-768a2503d6ec	ffa545d4-ea0e-4d9e-ab86-75c9e41ac5e6	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.118	gm
a84cd6da-45e0-420b-abd6-228c626cdcae	5236f491-da1a-49b0-84ee-14bbe8d2ec2e	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:07.139	gm
eaece786-e8b3-48f4-bccc-a8bb31c7d970	5236f491-da1a-49b0-84ee-14bbe8d2ec2e	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:07.142	gm
e2bcdaf9-e6ab-44d4-897b-242e58d78e87	5236f491-da1a-49b0-84ee-14bbe8d2ec2e	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:07.143	gm
b03bc86a-8d39-4920-85b3-1f5d7fa6683f	cffce6bf-6b3d-4c7c-adf8-fc62a99668ba	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:07.198	kg
c603b3cb-cf71-4969-a8e1-2718088b7e7f	cffce6bf-6b3d-4c7c-adf8-fc62a99668ba	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:07.201	gm
296250df-953c-4c16-8ef0-f179b1c2d2f5	d9c20473-982d-4f89-bb1c-65a2e262612f	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:07.223	pc
62f665a3-537b-413c-8374-78fc4b17c6fe	d9c20473-982d-4f89-bb1c-65a2e262612f	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:07.225	gm
cd31e5d2-8bcd-438c-bf97-1020a5c2a341	8ef0d56c-432e-4852-9897-8f44facd15b0	97d66b60-b3da-41f0-a6b0-305cbb2fb464	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:07.246	kg
afe76014-d2e9-410f-b154-f1bfafac4ded	8ef0d56c-432e-4852-9897-8f44facd15b0	0653ab92-5171-418b-89d2-9e6b60482bbb	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:07.249	gm
4ee863a8-7388-4a4e-a10b-bdc056c6bfa0	13e94e18-054f-46e8-9a88-1ccb2b967cfc	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:07.269	gm
5e3c4f3e-2c48-4bea-849c-3137c79b6dc0	13e94e18-054f-46e8-9a88-1ccb2b967cfc	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:07.272	gm
e91c1e6a-9908-4702-8a64-589d999299b9	13e94e18-054f-46e8-9a88-1ccb2b967cfc	7687b526-7d4f-40e5-b274-c66cca337009	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:07.273	gm
aee2f512-431e-40aa-8204-db82db051333	13e94e18-054f-46e8-9a88-1ccb2b967cfc	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.274	gm
583c88c1-e304-4a7d-8f17-6e04d095b36d	666df3c7-55ec-4fbd-bac5-28c4f072d2b0	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:07.294	gm
954e6082-4070-42d3-8612-0248c49f742a	666df3c7-55ec-4fbd-bac5-28c4f072d2b0	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:07.296	gm
61911a16-8835-43db-9c4a-6252f28e394d	666df3c7-55ec-4fbd-bac5-28c4f072d2b0	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:07.298	gm
4adc3b9f-46ad-4c76-8cfb-c62a34856166	666df3c7-55ec-4fbd-bac5-28c4f072d2b0	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:07.299	gm
d1c9bedf-4648-4b55-bc90-edc86fb0b975	38bcec07-15c2-40bc-9729-d4d66b354343	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:07.325	gm
58f62993-1b96-4ed0-af05-13e6f587d366	38bcec07-15c2-40bc-9729-d4d66b354343	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.328	gm
c230ab36-3596-4cd6-b326-02f9cef15063	38bcec07-15c2-40bc-9729-d4d66b354343	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:07.329	gm
6950ea56-7295-46a1-80cf-28fc9fd69c18	38bcec07-15c2-40bc-9729-d4d66b354343	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:07.33	gm
d67bc7f3-dd3d-4de9-bf57-c5b4299fa19f	8a9a1137-0eba-4d93-ab35-11d427fa9ce8	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:07.349	gm
91b0760b-1b77-40a0-9931-d50660d418ee	8a9a1137-0eba-4d93-ab35-11d427fa9ce8	738a0900-9798-424c-a3f6-04a98bcf3848	1	40.00	0.04	1	40.00	1000	0.04	2025-09-27 15:42:07.352	kg
47979698-7f9e-44a9-8a97-e1d8d4939acc	87522583-7317-4ec0-97c3-fdd663425e5b	6c1e3d72-7d97-40bb-97b4-93059631140f	4	60.00	60.00	4	15.00	1	60.00	2025-09-27 15:42:07.374	pc
9ce1efb1-58fc-48a9-9533-8d51d610c99a	87522583-7317-4ec0-97c3-fdd663425e5b	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.375	gm
7a334565-1444-4483-a716-7f967389da0b	87522583-7317-4ec0-97c3-fdd663425e5b	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.377	gm
9c10f1b3-ad01-4050-9913-95bd16ba0abe	ac94b2f0-e2a6-40f2-bd28-81212f817ecc	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.397	gm
9005c2cf-b3e6-4cfe-939e-e732b1139966	ac94b2f0-e2a6-40f2-bd28-81212f817ecc	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:07.399	gm
85da37a5-93cb-4123-9deb-60e41b68fdbb	ac94b2f0-e2a6-40f2-bd28-81212f817ecc	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:07.4	gm
4bdbbf1f-d3c0-40c3-94ef-d85715546e05	0fe79e91-aab9-45f8-91bc-b511759f894f	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.421	gm
0da8d003-1581-4c17-925f-1b850240be34	0fe79e91-aab9-45f8-91bc-b511759f894f	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:07.423	gm
9fff5711-4acb-4b2f-972f-1720a105447e	0fe79e91-aab9-45f8-91bc-b511759f894f	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:07.424	gm
240e05b5-675f-44d4-8474-b946b85329c5	bf0d2bd8-5752-4940-9067-95bbee22d55d	c623d1cc-09b3-48ae-96c1-e996053ab84a	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.447	gm
bc17825c-49d4-4a28-a178-18a01dbefa0e	bf0d2bd8-5752-4940-9067-95bbee22d55d	738a0900-9798-424c-a3f6-04a98bcf3848	1	40.00	0.04	1	40.00	1000	0.04	2025-09-27 15:42:07.449	kg
835d42b9-862f-4fe1-94ef-e7e43d26f578	166ddebe-3b71-42a1-99ca-57111d4f195f	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:07.479	gm
8a939512-bf56-435f-905b-004c799351aa	166ddebe-3b71-42a1-99ca-57111d4f195f	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:07.482	gm
59b84c4f-2615-4b53-a8b1-eaf13a8ab68b	166ddebe-3b71-42a1-99ca-57111d4f195f	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:07.483	gm
ff2b2b45-b647-4d10-a5b4-19d662ffbfed	166ddebe-3b71-42a1-99ca-57111d4f195f	2eae0636-1fa4-4d47-855f-306125787b1e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.485	gm
2410f3d4-a22b-4357-90c4-5dec68382933	166ddebe-3b71-42a1-99ca-57111d4f195f	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:07.485	gm
12f5d142-0cb8-45ef-ba0b-4a544b8c9898	166ddebe-3b71-42a1-99ca-57111d4f195f	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	100	6.00	6.00	100	60.00	1000	6.00	2025-09-27 15:42:07.486	gm
5fc1d03b-af79-40f2-acc8-dfb3409acebe	166ddebe-3b71-42a1-99ca-57111d4f195f	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:07.487	gm
5c7c5a31-9e3d-49b3-9474-3b41a912e4c6	a6f2fd9b-5871-4f5a-8ef2-f34f7414a669	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	25.00	250	25.00	2025-09-27 14:36:54.581094	gm
bbfa6d95-cf62-4f6e-9cae-cd7ee8c8834f	a6f2fd9b-5871-4f5a-8ef2-f34f7414a669	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	15.00	37.50	250	15.00	100	37.50	2025-09-27 14:36:54.581094	gm
458bc893-5f63-40ff-9bdf-cdbe343b0225	9562afc2-08bc-4b9a-8182-bd796f732e84	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:07.51	gm
5f87141c-09d0-4ed8-91e7-259febcae9ac	9562afc2-08bc-4b9a-8182-bd796f732e84	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:07.513	gm
ea2289d6-ae33-4759-9820-1e2b9c059458	9562afc2-08bc-4b9a-8182-bd796f732e84	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.514	gm
0dc2acc2-0026-48c9-908e-692f43ed2f6c	957082da-051e-46f6-b258-6cfb3a54b3ba	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:07.535	gm
93db8cae-6ca6-45a1-a7d4-f7b2f2aed3be	957082da-051e-46f6-b258-6cfb3a54b3ba	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.537	gm
22d327d5-a331-41c5-a4f4-48d39b339829	957082da-051e-46f6-b258-6cfb3a54b3ba	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:07.539	gm
0924ead8-73b0-4295-9d46-66b9240313da	957082da-051e-46f6-b258-6cfb3a54b3ba	c623d1cc-09b3-48ae-96c1-e996053ab84a	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.54	gm
36e21a0d-74c9-4e28-b7fc-8da024621cec	957082da-051e-46f6-b258-6cfb3a54b3ba	738a0900-9798-424c-a3f6-04a98bcf3848	1	40.00	0.04	1	40.00	1000	0.04	2025-09-27 15:42:07.54	kg
8daefdeb-277f-4f99-ba1f-2680b03af9d6	957082da-051e-46f6-b258-6cfb3a54b3ba	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:07.541	gm
c2a09835-402a-48f8-bc41-35c554192dad	957082da-051e-46f6-b258-6cfb3a54b3ba	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:07.542	gm
55c57c36-13f8-482d-a401-3a6eea857885	957082da-051e-46f6-b258-6cfb3a54b3ba	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.543	gm
b53e5795-e8db-48da-8469-53ba7ae780f5	957082da-051e-46f6-b258-6cfb3a54b3ba	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:07.544	gm
a1622c1a-e6e8-47fb-92a1-7ffb137b2568	f27347b8-c4ea-40a5-bc79-61b060d47dc9	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:07.57	gm
8a69c3c3-c642-4421-822b-da927c45e272	f27347b8-c4ea-40a5-bc79-61b060d47dc9	738a0900-9798-424c-a3f6-04a98bcf3848	1	40.00	0.04	1	40.00	1000	0.04	2025-09-27 15:42:07.572	kg
6ea4c4a4-c616-41a4-b6cc-2a8e3b89a0f2	f27347b8-c4ea-40a5-bc79-61b060d47dc9	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:07.573	gm
18a3e1f8-b287-4c31-a232-d50ab2a7c4eb	f27347b8-c4ea-40a5-bc79-61b060d47dc9	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:07.574	gm
be6976c8-d453-4434-90ed-1f71d92f3f91	f27347b8-c4ea-40a5-bc79-61b060d47dc9	be7965d2-e7ae-42dd-9731-b1195135005e	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:07.575	kg
36991a6d-0580-41e3-a273-3d16641b40a1	f27347b8-c4ea-40a5-bc79-61b060d47dc9	2eae0636-1fa4-4d47-855f-306125787b1e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.576	gm
ed3b9ac3-087e-45d2-91e9-5c70f5cc4088	f27347b8-c4ea-40a5-bc79-61b060d47dc9	c623d1cc-09b3-48ae-96c1-e996053ab84a	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.577	gm
30f70606-5635-40b6-8b7c-7f381d9c692e	f27347b8-c4ea-40a5-bc79-61b060d47dc9	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	15.00	500	30.00	1000	15.00	2025-09-27 15:42:07.577	kg
f805a837-aa4f-4fe8-a384-b1a71fc007e4	f27347b8-c4ea-40a5-bc79-61b060d47dc9	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:07.578	gm
698fbdea-59e6-438e-b6d7-7c808c186309	f27347b8-c4ea-40a5-bc79-61b060d47dc9	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.579	gm
2db4b773-99fd-49f1-b7df-81d4cb0bfcce	f27347b8-c4ea-40a5-bc79-61b060d47dc9	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:07.579	pc
0100a8c5-eb60-425e-8e59-76d0243f5e44	f27347b8-c4ea-40a5-bc79-61b060d47dc9	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.58	gm
d9d0fbaa-c1c1-46e5-a2e5-5dbab22b321c	f27347b8-c4ea-40a5-bc79-61b060d47dc9	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.58	gm
6bd82206-84ad-4dc6-9de4-db8f8822e332	b66559cc-bb8d-41e7-bf3f-03d751d0cb1f	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:07.602	gm
258632b4-9ca9-4e4e-833c-dc38f26d033f	b66559cc-bb8d-41e7-bf3f-03d751d0cb1f	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	200	16.00	16.00	200	80.00	1000	16.00	2025-09-27 15:42:07.603	gm
1a36696a-c35f-437c-b0ce-4b2c6fb0c5da	b66559cc-bb8d-41e7-bf3f-03d751d0cb1f	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.604	gm
9f6de5ee-d79b-4cb1-bd3a-b5ce7dc5ecca	b66559cc-bb8d-41e7-bf3f-03d751d0cb1f	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:07.604	gm
9196e28f-2a81-4a03-9712-fd36e0ef5ebe	066569cb-c438-45cd-b567-d0a798a2b126	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:07.626	gm
cdb4f6c6-95e8-4041-b7aa-08b54a0b1e1e	066569cb-c438-45cd-b567-d0a798a2b126	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.628	gm
4ca9d546-805a-45d1-bfa0-eee1039fd1d8	5fe1f299-fb2f-4628-9ee4-c23c80cecda5	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:07.663	gm
b1b7efb9-0923-4b41-bbf6-d4001246fb76	5fe1f299-fb2f-4628-9ee4-c23c80cecda5	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:07.665	gm
c3fc0275-8954-4f7f-be4d-34e6f8885076	5fe1f299-fb2f-4628-9ee4-c23c80cecda5	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.666	gm
1af8fb4f-dab3-4dcd-b7bb-50e040877ee4	ef742e35-4021-4c94-a0b5-15af92a03203	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:07.685	pc
aa40f51a-31d6-4d8c-a267-975f4743505e	ef742e35-4021-4c94-a0b5-15af92a03203	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:07.688	gm
f6068506-e0f4-4d85-a378-f38c5c24d715	ef742e35-4021-4c94-a0b5-15af92a03203	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	400	48.00	48.00	400	120.00	1000	48.00	2025-09-27 15:42:07.689	gm
aaaefc07-5ba3-4167-814e-78f8e5cdf2cc	ef742e35-4021-4c94-a0b5-15af92a03203	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.69	gm
1a9ac592-056a-4847-9f95-58f339ab44d8	ef742e35-4021-4c94-a0b5-15af92a03203	7687b526-7d4f-40e5-b274-c66cca337009	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:07.691	gm
27df6cf6-b8e2-4a80-bac9-851efca3e345	ef742e35-4021-4c94-a0b5-15af92a03203	81ee7d10-3404-4ae2-b740-8acf875e3ba2	400	40.00	40.00	400	100.00	1000	40.00	2025-09-27 15:42:07.691	gm
25ded9fb-c5d1-45bf-a7b2-b2fcb7448b8a	ef742e35-4021-4c94-a0b5-15af92a03203	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:07.692	gm
5eb26745-5b20-4dc7-963c-e5cdf29258d0	ef742e35-4021-4c94-a0b5-15af92a03203	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:07.692	gm
f241522b-abf0-4223-9098-7c45766a3537	476f4057-847b-48e3-805a-34dc5f1c7b63	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:07.716	gm
418a0530-2603-44ca-917b-89d558b010e1	476f4057-847b-48e3-805a-34dc5f1c7b63	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:07.718	gm
d9beae90-62d2-4183-9b57-2ee0208df21c	476f4057-847b-48e3-805a-34dc5f1c7b63	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:07.72	gm
f788214e-9684-480f-b730-5e269b0c481e	476f4057-847b-48e3-805a-34dc5f1c7b63	c623d1cc-09b3-48ae-96c1-e996053ab84a	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.72	gm
ff695986-ffa7-4c4e-8566-4b00d882a112	476f4057-847b-48e3-805a-34dc5f1c7b63	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	100	8.00	8.00	100	80.00	1000	8.00	2025-09-27 15:42:07.721	gm
131edf84-ee5b-4360-a9cc-89c355a69115	476f4057-847b-48e3-805a-34dc5f1c7b63	2eae0636-1fa4-4d47-855f-306125787b1e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.722	gm
73b25181-f8ea-4335-8b06-faf2870d106e	c245f393-4614-44df-ba88-964acde66c4c	be7965d2-e7ae-42dd-9731-b1195135005e	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:07.741	kg
41b34b6d-e4af-4a1d-8ab7-e3622980649d	c245f393-4614-44df-ba88-964acde66c4c	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.743	gm
7ddcc170-d1bb-4eea-8ef9-c14bd046b3e3	c245f393-4614-44df-ba88-964acde66c4c	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:07.744	gm
9e94f24d-890c-48ad-afb4-0cdba75f6b16	35ae2124-ec0a-4fe0-9550-74343a0864f3	c623d1cc-09b3-48ae-96c1-e996053ab84a	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.766	gm
e96a9ef9-1f02-4e21-98f1-d2605bcee6b9	35ae2124-ec0a-4fe0-9550-74343a0864f3	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.769	gm
62f0c0bb-a332-41f5-b4a7-7c049af64a88	0c491ae1-8e9c-4b1e-bdc3-a574fac32d5b	c623d1cc-09b3-48ae-96c1-e996053ab84a	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.789	gm
5a3f2b3e-ade1-448e-88e4-66bbdf2fe985	7cf31a95-f5ba-4405-9b18-b6ec178510d9	738a0900-9798-424c-a3f6-04a98bcf3848	1	40.00	0.04	1	40.00	1000	0.04	2025-09-27 15:42:07.814	kg
d07586ee-e71e-45dd-8fc1-577f79eec7a4	7cf31a95-f5ba-4405-9b18-b6ec178510d9	c623d1cc-09b3-48ae-96c1-e996053ab84a	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.817	gm
bdbd0396-81bb-4a78-8a0a-22b0cfa97089	a6f2fd9b-5871-4f5a-8ef2-f34f7414a669	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-09-27 14:36:54.581094	pc
89e61795-d4dd-4a1a-96f7-2f75cbffd382	a6f2fd9b-5871-4f5a-8ef2-f34f7414a669	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	30.00	1	30.00	1000	30.00	2025-09-27 14:36:54.581094	kg
2716f654-bdd5-4ca9-b727-346255a64a65	515b6660-8365-4296-8a30-ceb64db50b17	c623d1cc-09b3-48ae-96c1-e996053ab84a	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.843	gm
39e3f432-3fd1-4bbb-bd20-b9dd283a5e23	515b6660-8365-4296-8a30-ceb64db50b17	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:07.846	pc
96b51db7-cd45-4de8-a793-8de35e742080	c1276a53-e47e-42eb-a8fc-c0893f744af9	81ee7d10-3404-4ae2-b740-8acf875e3ba2	300	30.00	30.00	300	100.00	1000	30.00	2025-09-27 15:42:07.87	gm
d77433d4-541b-4aee-b36a-50257f041dde	c1276a53-e47e-42eb-a8fc-c0893f744af9	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:07.873	gm
ee1832dc-50b3-4ed4-b044-a28ecde31599	a1e1f4e2-943a-4f8a-996f-fe8c2943c8f0	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:07.894	gm
55a65062-c80b-415a-833e-f3c5fff73d88	a1e1f4e2-943a-4f8a-996f-fe8c2943c8f0	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.897	gm
70489bea-e061-40d1-916e-56bf2a5b9444	a1e1f4e2-943a-4f8a-996f-fe8c2943c8f0	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:07.899	gm
a28bc7b9-ab59-44cb-98c0-8a075b9654c9	a1e1f4e2-943a-4f8a-996f-fe8c2943c8f0	738a0900-9798-424c-a3f6-04a98bcf3848	1	40.00	0.04	1	40.00	1000	0.04	2025-09-27 15:42:07.9	kg
a18b4351-3b2c-481a-b9f0-4ba2b202cafa	a1e1f4e2-943a-4f8a-996f-fe8c2943c8f0	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:07.9	gm
863f2306-7cb5-4577-8b4e-935177f703f1	a1e1f4e2-943a-4f8a-996f-fe8c2943c8f0	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:07.901	gm
ed4f3bca-86c5-4f7d-ba03-dfe7544bc893	2cc32a66-c17b-4b26-bc87-18925a56e9aa	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.921	gm
a120f486-2068-4356-8f0d-32ec9afcd7fc	2cc32a66-c17b-4b26-bc87-18925a56e9aa	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.924	gm
3824c382-c6b8-46d2-aad2-54555889d78e	2cc32a66-c17b-4b26-bc87-18925a56e9aa	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.925	gm
4874da75-6891-4eff-b1d1-6ff469ff9751	2cc32a66-c17b-4b26-bc87-18925a56e9aa	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:07.926	gm
cc42ea77-25ad-49d0-befe-4b7850b74dea	53bb26e9-b069-489d-a732-418aa5d25cc1	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.948	gm
c6a133ef-620c-485d-8051-3d2b696a7f38	53bb26e9-b069-489d-a732-418aa5d25cc1	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	247	20.00	20.00	247	80.97	1000	20.00	2025-09-27 15:42:07.951	gm
5b8355ac-b5b3-4b25-9257-9d6c8f1fba41	53bb26e9-b069-489d-a732-418aa5d25cc1	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:07.952	gm
9a514381-ba0a-42d7-90f0-357281eca418	53bb26e9-b069-489d-a732-418aa5d25cc1	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:07.953	gm
0817319c-a936-40a8-97b1-732990a7d725	53bb26e9-b069-489d-a732-418aa5d25cc1	be7965d2-e7ae-42dd-9731-b1195135005e	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:07.954	kg
512ea7cc-6245-4e30-bca0-5001deead939	53bb26e9-b069-489d-a732-418aa5d25cc1	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:07.955	gm
47d34ae4-55ca-4282-8205-1ba8ea51aff6	53bb26e9-b069-489d-a732-418aa5d25cc1	97d66b60-b3da-41f0-a6b0-305cbb2fb464	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:07.956	gm
56a6b657-bdf3-46ea-8132-b058c6b61ae3	53bb26e9-b069-489d-a732-418aa5d25cc1	6c1e3d72-7d97-40bb-97b4-93059631140f	4	60.00	60.00	4	15.00	1	60.00	2025-09-27 15:42:07.957	pc
e555f569-6955-475c-a76c-e62b96b36898	8a6ba159-07b9-4a29-b2bc-a80b58bf3034	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:07.979	kg
fdbe9877-c577-412c-a6c4-3f3789a58074	8a6ba159-07b9-4a29-b2bc-a80b58bf3034	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:07.981	gm
2c0a77b6-ed41-423f-a7f1-0a381afd0c2e	8a6ba159-07b9-4a29-b2bc-a80b58bf3034	2eae0636-1fa4-4d47-855f-306125787b1e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:07.981	gm
281d9652-3b2e-44af-9ada-c8cd87e24f86	8a6ba159-07b9-4a29-b2bc-a80b58bf3034	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:07.982	gm
73ae2656-b17f-4c6d-b419-90352d0d6c51	8a6ba159-07b9-4a29-b2bc-a80b58bf3034	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:07.983	gm
3fbf063c-aff4-4225-aafb-bab8dc8e3d20	8a6ba159-07b9-4a29-b2bc-a80b58bf3034	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:07.984	gm
672f0a69-12cf-4214-9f66-44b634d79b02	313918ab-5783-43fb-8b63-14e0b45b60f8	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.005	gm
8dfcef30-1bc4-464a-91f2-4455879d09ae	313918ab-5783-43fb-8b63-14e0b45b60f8	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.008	gm
5645d3ba-9397-4504-837f-98b4821d49eb	313918ab-5783-43fb-8b63-14e0b45b60f8	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.009	gm
69bcf2ec-a042-42a5-9986-88d52d006739	313918ab-5783-43fb-8b63-14e0b45b60f8	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.01	gm
fd7df770-3a9e-4d2f-b2bd-778a4fc5319d	313918ab-5783-43fb-8b63-14e0b45b60f8	7687b526-7d4f-40e5-b274-c66cca337009	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.01	gm
9527e752-53e2-4039-be2f-91bf494905a3	313918ab-5783-43fb-8b63-14e0b45b60f8	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:08.011	gm
e68a8681-3653-416b-815d-b0f2e8a8011b	313918ab-5783-43fb-8b63-14e0b45b60f8	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:08.012	pc
185efc9b-d275-41ab-9a64-0175bb501f08	cace3681-4b37-44f1-9ef0-d5a01c4017d4	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:08.034	gm
043cd60d-02d1-4992-83de-023c3c923345	cace3681-4b37-44f1-9ef0-d5a01c4017d4	682089ef-89e9-4860-bfe0-e286ada294dd	300	18.00	18.00	300	60.00	1000	18.00	2025-09-27 15:42:08.036	gm
d35d3072-a7cb-42ac-b6e9-822527b120a6	cace3681-4b37-44f1-9ef0-d5a01c4017d4	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	150	23.00	23.00	150	153.33	1000	23.00	2025-09-27 15:42:08.037	gm
1cfbc5d9-889b-46b2-906b-5129c2184289	cace3681-4b37-44f1-9ef0-d5a01c4017d4	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:08.038	gm
93310dd5-6de3-44cf-b9c8-74ce4d4fb4fb	cace3681-4b37-44f1-9ef0-d5a01c4017d4	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:08.039	gm
4f29f1f7-9bcd-4ab7-bf40-89a5f7068165	cace3681-4b37-44f1-9ef0-d5a01c4017d4	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.04	gm
d1a67e16-07cf-4231-9b03-4b52c34e39f0	ad6596e0-5bdc-4730-a0a3-2bed45b9a5cc	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.058	gm
d99211b8-6a23-45f5-af40-11e524117a56	ad6596e0-5bdc-4730-a0a3-2bed45b9a5cc	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:08.06	gm
a1ea18e3-4a97-4c51-9f3b-2d90a23f79b8	ad6596e0-5bdc-4730-a0a3-2bed45b9a5cc	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:08.061	gm
29ed9131-6789-4d90-844b-dcc1a609955d	ad6596e0-5bdc-4730-a0a3-2bed45b9a5cc	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.061	gm
0ded0c4e-490c-4338-8b85-02dc892569d3	ad6596e0-5bdc-4730-a0a3-2bed45b9a5cc	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.062	gm
5300b3b8-7854-43e5-96ac-e2069bee50fc	7e0d1981-de41-41fa-8443-0af742c3da6d	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:08.081	gm
5c0f2107-1469-405a-8ade-7414b79ff379	7e0d1981-de41-41fa-8443-0af742c3da6d	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:08.083	gm
0d718c43-ac7a-4311-9cd4-f21611b9dbd1	d7b7c971-0a43-46a4-b18f-aea3f1044e85	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.105	gm
ab92a81b-9b73-459f-9b91-57d5fd98d08b	d7b7c971-0a43-46a4-b18f-aea3f1044e85	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:08.108	gm
648c4393-326c-4166-8946-f909d42295d9	d7b7c971-0a43-46a4-b18f-aea3f1044e85	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:08.109	gm
1d0215de-d5d9-4895-8a86-64737b2caec3	d7b7c971-0a43-46a4-b18f-aea3f1044e85	6c1e3d72-7d97-40bb-97b4-93059631140f	4	60.00	60.00	4	15.00	1	60.00	2025-09-27 15:42:08.11	pc
5bb95ae4-e805-40f4-b42b-43163c4291bf	d7b7c971-0a43-46a4-b18f-aea3f1044e85	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:08.111	gm
5ab91b13-a67d-43bc-b334-7a8d066a4a1d	d7b7c971-0a43-46a4-b18f-aea3f1044e85	7687b526-7d4f-40e5-b274-c66cca337009	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.112	gm
4ca1d1dc-c551-4a28-9266-d655bd498468	f54dd8f4-9e9f-4913-9277-53925fb29c15	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.153	gm
04bccd65-b047-4e31-a5e9-fa99df0e32a3	f54dd8f4-9e9f-4913-9277-53925fb29c15	682089ef-89e9-4860-bfe0-e286ada294dd	1000	60.00	60.00	1000	60.00	1000	60.00	2025-09-27 15:42:08.155	gm
f59a0478-bcc4-4491-8b7b-3d89a629c6c2	a6f2fd9b-5871-4f5a-8ef2-f34f7414a669	7fded13b-5795-4f23-a8ba-c1c830755b18	100	35.00	7.00	100	35.00	500	7.00	2025-09-27 14:36:54.581094	gm
5fa28a5b-5986-43fa-9cf8-eeef9a9fffaa	a6f2fd9b-5871-4f5a-8ef2-f34f7414a669	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	30.00	15.00	250	30.00	500	15.00	2025-09-27 14:36:54.581094	gm
3575bc53-cd6d-4073-b4ff-e4f129cf297f	f88b1081-2eaa-47d8-94fa-34b1bccd940a	cba9a138-b913-47df-b1fa-61663c7603b0	1	100.00	0.10	1	100.00	1000	0.10	2025-09-27 15:42:08.177	kg
8530d950-5c84-42e3-8abf-8b4af521239a	f88b1081-2eaa-47d8-94fa-34b1bccd940a	2eae0636-1fa4-4d47-855f-306125787b1e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:08.18	gm
3da449b7-7da0-47bb-9f96-5b00f91eb4c4	80347a8a-5d53-4cde-be7a-868d14b85afb	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:08.204	gm
ed2fd0a2-937f-49fc-a0e5-ecea1d538125	80347a8a-5d53-4cde-be7a-868d14b85afb	7687b526-7d4f-40e5-b274-c66cca337009	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.207	gm
65d07d82-06da-49df-a870-c5bc2bafd8fc	80347a8a-5d53-4cde-be7a-868d14b85afb	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.208	gm
88edb01e-b556-4045-9322-a12e44b2f86a	80347a8a-5d53-4cde-be7a-868d14b85afb	2eae0636-1fa4-4d47-855f-306125787b1e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.209	gm
31052854-213a-4e4c-9203-142492eb815f	69cec71c-b15b-446e-b065-76969f4573b0	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.229	gm
5da8c212-fe81-4256-9fa9-13eb4c99bfb7	69cec71c-b15b-446e-b065-76969f4573b0	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.232	gm
df72658c-5d75-4dda-a9f6-d18346633722	69cec71c-b15b-446e-b065-76969f4573b0	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.233	gm
910e5043-93e0-4902-827e-3611a64a9c37	69cec71c-b15b-446e-b065-76969f4573b0	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.234	gm
e31d7742-592d-4973-b99b-962b8fe95cc1	e67d39aa-98c3-435c-9407-3b8d178d9308	0653ab92-5171-418b-89d2-9e6b60482bbb	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.253	gm
db09d638-f878-4853-932e-6034ddef6eed	e67d39aa-98c3-435c-9407-3b8d178d9308	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:08.255	gm
ab386ff3-e1ad-4015-b413-de891aaed41f	e67d39aa-98c3-435c-9407-3b8d178d9308	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.256	gm
e24dbcf3-1dbd-4bd3-9257-1e8806f54204	e67d39aa-98c3-435c-9407-3b8d178d9308	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:08.256	gm
d3db01f3-3e76-4e95-b1af-9e9a409a07df	e67d39aa-98c3-435c-9407-3b8d178d9308	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:08.257	pc
e588ef8e-9c34-408a-a70e-dae5e38e6273	e67d39aa-98c3-435c-9407-3b8d178d9308	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.258	gm
c5a1e1ce-c37c-4f1a-9562-a490f3bd310b	f0eb3c49-3d48-410e-90a9-7df8cb608a9a	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	70.00	70.00	1	70.00	1000	70.00	2025-09-27 15:42:08.279	kg
a542e50a-be8e-44b8-b45f-18270ddcc971	f0eb3c49-3d48-410e-90a9-7df8cb608a9a	738a0900-9798-424c-a3f6-04a98bcf3848	1	40.00	0.04	1	40.00	1000	0.04	2025-09-27 15:42:08.281	kg
58290979-2dda-4cf2-a66c-39d9de65ac6f	f0eb3c49-3d48-410e-90a9-7df8cb608a9a	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:08.283	gm
6b419300-82d4-4c17-81e5-e719fc088f2e	f0eb3c49-3d48-410e-90a9-7df8cb608a9a	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:08.284	gm
531c1265-c0fd-436f-bac2-18ab6a5ce802	7feecf15-742d-4089-997c-0187e755d5f0	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:08.307	gm
9b25706f-1616-4681-829d-50c0ceba853f	7feecf15-742d-4089-997c-0187e755d5f0	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	300	30.00	30.00	300	100.00	1000	30.00	2025-09-27 15:42:08.31	gm
a349dd6c-c126-45e6-9417-886375097d7c	7feecf15-742d-4089-997c-0187e755d5f0	cba9a138-b913-47df-b1fa-61663c7603b0	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:08.312	gm
7bb7b924-b4c6-45a8-a65d-4b31c23f243d	7feecf15-742d-4089-997c-0187e755d5f0	2eae0636-1fa4-4d47-855f-306125787b1e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.313	gm
d513fd16-93d2-4354-beb2-5e1d84cdc2af	7feecf15-742d-4089-997c-0187e755d5f0	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:08.314	gm
78675ae3-d35e-49de-a52c-ea57d925690e	7feecf15-742d-4089-997c-0187e755d5f0	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:08.315	gm
5366df97-8192-4b52-ba6b-017232058932	9091cdea-e417-4417-8c4f-00171bae88c4	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:08.333	gm
db11be95-6912-49e5-904e-c0260b5233de	9091cdea-e417-4417-8c4f-00171bae88c4	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:08.336	kg
bcec1034-f34d-4b42-812f-2452808dfdad	9091cdea-e417-4417-8c4f-00171bae88c4	cba9a138-b913-47df-b1fa-61663c7603b0	1	100.00	0.10	1	100.00	1000	0.10	2025-09-27 15:42:08.337	kg
f9e832ac-33cb-4987-9abd-702eaa14a802	9091cdea-e417-4417-8c4f-00171bae88c4	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.338	gm
3e3b0a09-4ee5-4ca4-9130-68d9797e15d7	9091cdea-e417-4417-8c4f-00171bae88c4	738a0900-9798-424c-a3f6-04a98bcf3848	2	80.00	0.16	2	80.00	1000	0.16	2025-09-27 15:42:08.339	kg
95b4a87f-9a37-4244-966c-880f0a6dd381	9091cdea-e417-4417-8c4f-00171bae88c4	0653ab92-5171-418b-89d2-9e6b60482bbb	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.34	gm
4042c5cf-fbcd-4034-b51c-60d56f8c1eb4	9091cdea-e417-4417-8c4f-00171bae88c4	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:08.341	gm
fadb8eac-d933-4a39-9ae3-ac2557d5794b	dbff1e87-2699-44b8-9d03-2e0b0b2ba8ef	2eae0636-1fa4-4d47-855f-306125787b1e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.361	gm
56865dc5-0ab9-4713-832a-b4e5822eccda	dbff1e87-2699-44b8-9d03-2e0b0b2ba8ef	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:08.364	gm
abb8ecef-7da7-4255-ad4d-8475781c7bf5	dbff1e87-2699-44b8-9d03-2e0b0b2ba8ef	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.365	gm
593e2b40-cc40-43f4-bf71-fc2f35c13ff2	dbff1e87-2699-44b8-9d03-2e0b0b2ba8ef	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.365	gm
7120103b-e1d3-4525-a98b-a671578dd0e2	dbff1e87-2699-44b8-9d03-2e0b0b2ba8ef	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.366	gm
7cb5580d-69d6-4e80-843b-0452add681ff	dbff1e87-2699-44b8-9d03-2e0b0b2ba8ef	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:08.367	gm
119c7684-a507-427c-a6c2-8cebe4d2e30e	397fbbcb-7e09-4921-8523-4bdcbf0cc1a7	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:08.386	gm
29948678-268b-480f-93b6-96ed0a2e60c3	fb9c755f-18dc-4059-899b-e945874cfdbd	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.409	gm
7cbdad19-10a2-4edc-9a84-4a67a864fd9f	fb9c755f-18dc-4059-899b-e945874cfdbd	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.411	gm
489a4a33-15fa-42e3-86ba-b8cdb54c35ba	fb9c755f-18dc-4059-899b-e945874cfdbd	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.412	gm
fed6472c-976b-4368-9d95-caa089167e1a	fb9c755f-18dc-4059-899b-e945874cfdbd	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.413	gm
c79939f9-a97c-412a-a444-12b44f109d3c	fb9c755f-18dc-4059-899b-e945874cfdbd	2eae0636-1fa4-4d47-855f-306125787b1e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.414	gm
18e66d80-afa4-4787-ad7f-2d36554f33de	fb9c755f-18dc-4059-899b-e945874cfdbd	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.415	gm
29a27a3b-e914-49c0-a468-7773d13ecf85	8d76300f-0c02-44c6-a9de-578342a7b1ee	81ee7d10-3404-4ae2-b740-8acf875e3ba2	750	60.00	60.00	750	80.00	1000	60.00	2025-09-27 15:42:08.437	gm
3777058b-d406-45dd-a8b7-a90208f098a9	8d76300f-0c02-44c6-a9de-578342a7b1ee	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	15.00	500	30.00	1000	15.00	2025-09-27 15:42:08.439	kg
ad646187-40ea-45b4-91c5-81d9c7f3875a	8d76300f-0c02-44c6-a9de-578342a7b1ee	7687b526-7d4f-40e5-b274-c66cca337009	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.439	gm
214af905-5d5e-4f9e-8f48-aee938daa0a4	8d76300f-0c02-44c6-a9de-578342a7b1ee	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	750	60.00	60.00	750	80.00	1000	60.00	2025-09-27 15:42:08.44	gm
f1edde37-26c7-4c5f-bbb0-3cbfca766a40	8d76300f-0c02-44c6-a9de-578342a7b1ee	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.441	gm
1263f69d-753c-445f-a5bc-ce997c51e122	8d76300f-0c02-44c6-a9de-578342a7b1ee	2eae0636-1fa4-4d47-855f-306125787b1e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.442	gm
05e7f11f-21f9-4efe-8ce1-b5b897958281	8d76300f-0c02-44c6-a9de-578342a7b1ee	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	200	30.00	30.00	200	150.00	1000	30.00	2025-09-27 15:42:08.443	gm
c75e44d1-7bdf-4131-9238-c0e924b0a3bb	0cc7a61c-145b-4609-b618-a45d8351d1c2	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:08.461	gm
a14e806e-26f6-4f8c-8003-33de80f4b5cd	eee2160f-b55c-4cc9-90ef-48e5bd5b8a31	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.505	gm
c11fd4b1-1390-4b6a-8b2f-944c7df49b9b	eee2160f-b55c-4cc9-90ef-48e5bd5b8a31	738a0900-9798-424c-a3f6-04a98bcf3848	1	40.00	0.04	1	40.00	1000	0.04	2025-09-27 15:42:08.506	kg
f5773b0e-84a3-4fe1-8131-7669bda9b05a	a6f2fd9b-5871-4f5a-8ef2-f34f7414a669	c1c3bf43-b581-408e-9317-57d81fa7ae00	500	60.00	60.00	500	60.00	500	60.00	2025-09-27 14:36:54.581094	gm
9616361b-13a0-45bc-8bd8-8dcdc42efb33	eee2160f-b55c-4cc9-90ef-48e5bd5b8a31	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.508	gm
43be6e63-af08-4719-9780-6bfb3025ca2e	eee2160f-b55c-4cc9-90ef-48e5bd5b8a31	6c1e3d72-7d97-40bb-97b4-93059631140f	4	60.00	60.00	4	15.00	1	60.00	2025-09-27 15:42:08.509	pc
74d8da0d-4254-4aa6-a3f6-4cb1713cec9e	3c1a6be1-0d50-4a65-a91f-66a55da53abb	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.529	gm
eca61883-d172-44e2-856f-dd12ac212f22	d853efe4-df32-48b5-9e92-bed8df90e6ee	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:08.549	gm
113df0fc-c4c0-4749-a875-f5281b3a33c0	d853efe4-df32-48b5-9e92-bed8df90e6ee	738a0900-9798-424c-a3f6-04a98bcf3848	1	40.00	0.04	1	40.00	1000	0.04	2025-09-27 15:42:08.552	kg
34ff562c-1913-4cd5-944b-818c2ed37345	d853efe4-df32-48b5-9e92-bed8df90e6ee	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.554	gm
c339fded-123e-43ac-a044-fd7cd273daaf	d853efe4-df32-48b5-9e92-bed8df90e6ee	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:08.555	pc
3239d020-ec01-460a-bef0-624aed1e82e1	5ada5f7a-da50-4ac1-b6ee-17e7d4391aed	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:08.575	gm
bc02af05-9639-4404-ac61-7431afa10360	5ada5f7a-da50-4ac1-b6ee-17e7d4391aed	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.577	gm
b9ee423a-2154-457b-b2d4-95f9fee88b5d	5ada5f7a-da50-4ac1-b6ee-17e7d4391aed	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:08.578	gm
272e2f57-01dd-4342-ab87-b38def435836	ddaa9c9f-eb35-49e7-884d-4f1b9d1c4ada	738a0900-9798-424c-a3f6-04a98bcf3848	2	80.00	0.16	2	80.00	1000	0.16	2025-09-27 15:42:08.601	kg
206eeb34-b105-43d7-971a-628572294d92	ddaa9c9f-eb35-49e7-884d-4f1b9d1c4ada	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.604	gm
4b9fbc24-a038-43a9-ac0d-3831d74a5550	ddaa9c9f-eb35-49e7-884d-4f1b9d1c4ada	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.605	gm
fbb3f7ad-0319-412c-a683-c9d8adef46c3	7604530b-f203-4971-8fcb-2509b62ee25a	97d66b60-b3da-41f0-a6b0-305cbb2fb464	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.625	gm
6a70d2c1-4706-4bd2-8b97-9a8a18d88ab3	7604530b-f203-4971-8fcb-2509b62ee25a	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.627	gm
d9e8e013-f292-4cbe-9357-6e96e44ea9dc	7604530b-f203-4971-8fcb-2509b62ee25a	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.629	gm
104310ab-7397-4fac-af1a-3b276482cf5b	191fafe4-81f1-406b-ab83-0b2a169111d2	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.649	gm
769db51e-3b9e-4868-acdc-64ce595147d9	191fafe4-81f1-406b-ab83-0b2a169111d2	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.651	gm
56bfaf2f-9de0-4420-a651-7ee8c445569c	191fafe4-81f1-406b-ab83-0b2a169111d2	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:08.652	gm
0f759bda-c85b-4c34-8b07-d884b4c5fcad	76ed92de-e4f2-4f62-84d0-17bfd5395530	cba9a138-b913-47df-b1fa-61663c7603b0	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:08.678	gm
7025bd12-0d23-4621-a015-21aeefacb925	76ed92de-e4f2-4f62-84d0-17bfd5395530	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:08.679	gm
bc1345d0-f834-4139-9e24-51e2bae11508	2dfdd519-d012-4b85-832e-bef3a6795850	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.924	gm
10a07d49-20d5-46d6-a7f0-31a2851174d2	2dfdd519-d012-4b85-832e-bef3a6795850	cba9a138-b913-47df-b1fa-61663c7603b0	1	100.00	0.10	1	100.00	1000	0.10	2025-09-27 15:42:08.927	kg
3ff7f582-0746-4a1d-8060-aad0fbad9058	2dfdd519-d012-4b85-832e-bef3a6795850	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:08.928	gm
73e4a868-bcf5-4a31-bc67-4e4106452417	2dfdd519-d012-4b85-832e-bef3a6795850	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:08.929	gm
98cbdb72-3a0e-45c8-9d5f-84469fab3a9d	2dfdd519-d012-4b85-832e-bef3a6795850	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:08.93	gm
6934bdab-530a-4f8b-93de-2db33a7a6362	23fd0ace-9691-4a3d-9ed3-1aa4766c8439	2eae0636-1fa4-4d47-855f-306125787b1e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:08.95	gm
77399188-e0c6-458f-9ef3-d0f87a437979	23fd0ace-9691-4a3d-9ed3-1aa4766c8439	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:08.953	gm
84893f41-8f0a-43c6-9f80-36e8087553f6	23fd0ace-9691-4a3d-9ed3-1aa4766c8439	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:08.954	gm
e8ca81f5-50ff-4ca6-b33d-d6af692165d8	36ffc8c2-40ba-4105-914a-cba4a52ba7b5	cba9a138-b913-47df-b1fa-61663c7603b0	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09	gm
61af0e26-7bc6-45b3-9f9b-c8b110c841a5	36ffc8c2-40ba-4105-914a-cba4a52ba7b5	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	13.00	13.00	250	52.00	1000	13.00	2025-09-27 15:42:09.002	gm
df38ec09-abab-4696-8b2d-c7977950e149	36ffc8c2-40ba-4105-914a-cba4a52ba7b5	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.003	gm
f2eced0f-5123-4668-be8a-4ac92e7ae754	36ffc8c2-40ba-4105-914a-cba4a52ba7b5	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:09.004	gm
6efd7fcb-8de4-4850-a5b7-18f2cde57111	36ffc8c2-40ba-4105-914a-cba4a52ba7b5	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.005	gm
99dee1ca-927f-41ec-ae7c-b8bd4179d0a8	36ffc8c2-40ba-4105-914a-cba4a52ba7b5	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:09.005	gm
78c258d6-3058-4544-b62a-dc4a04a8196b	36ffc8c2-40ba-4105-914a-cba4a52ba7b5	97d66b60-b3da-41f0-a6b0-305cbb2fb464	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.006	gm
4cb9f153-5201-49f3-bdbf-d03bbfd9acce	36ffc8c2-40ba-4105-914a-cba4a52ba7b5	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.007	gm
421b2d50-bdf3-487a-bd0a-a44163b6bd08	36ffc8c2-40ba-4105-914a-cba4a52ba7b5	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.008	gm
cb587c82-9b72-489c-8a8f-063be5f2beda	e00cf6fe-42d9-4e6c-89aa-2550271f341e	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.032	gm
cdf2d5cd-1d1f-4742-bb0c-7c21b17a7984	e00cf6fe-42d9-4e6c-89aa-2550271f341e	c623d1cc-09b3-48ae-96c1-e996053ab84a	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.034	gm
b686a940-69b5-4a61-ae60-323e33b1dd73	e00cf6fe-42d9-4e6c-89aa-2550271f341e	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.035	gm
483a00cd-842d-4e42-9384-0045cefa8a3d	e7e62d26-e4be-4145-be6d-1c3e26b9be9b	35660cc6-d186-4b87-9c97-3c07bbc5303f	150	8.00	8.00	150	53.33	1000	8.00	2025-09-27 15:42:09.076	gm
5e51f212-ea47-42a9-ae40-0122d428e498	e7e62d26-e4be-4145-be6d-1c3e26b9be9b	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	400	28.00	28.00	400	70.00	1000	28.00	2025-09-27 15:42:09.079	gm
41bd4b67-60d2-4147-8252-4fa5f857d763	e7e62d26-e4be-4145-be6d-1c3e26b9be9b	0653ab92-5171-418b-89d2-9e6b60482bbb	300	18.00	18.00	300	60.00	1000	18.00	2025-09-27 15:42:09.081	gm
b3140f88-cf8d-4956-ac8c-6003d59cd651	e7e62d26-e4be-4145-be6d-1c3e26b9be9b	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.082	gm
8966d50d-eb93-46a5-a009-7db2844a8ff6	e7e62d26-e4be-4145-be6d-1c3e26b9be9b	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.083	gm
cf8e696a-83d1-4b40-9ef8-e44b7849f913	e7e62d26-e4be-4145-be6d-1c3e26b9be9b	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.084	gm
6399508c-7b53-485d-9288-de28d5af5688	e7e62d26-e4be-4145-be6d-1c3e26b9be9b	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.085	gm
83ba3327-4385-48aa-82b9-51c4bfb3554a	e7e62d26-e4be-4145-be6d-1c3e26b9be9b	738a0900-9798-424c-a3f6-04a98bcf3848	2	60.00	0.12	2	60.00	1000	0.12	2025-09-27 15:42:09.086	kg
95286be6-d221-440c-b61c-59163b03dfbc	e7e62d26-e4be-4145-be6d-1c3e26b9be9b	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:09.087	gm
356cb0fb-8c32-4b4f-8ca3-726c334d43af	e7e62d26-e4be-4145-be6d-1c3e26b9be9b	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:09.088	pc
4bd918a7-1179-44d0-a11a-5247e84878a7	b58c104e-2e12-4801-9c30-6d97228c8b79	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:09.109	gm
11b3660f-16ab-4c58-9e4e-c4da0e360a33	b58c104e-2e12-4801-9c30-6d97228c8b79	7fded13b-5795-4f23-a8ba-c1c830755b18	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.11	gm
0d7f32b0-2696-47d3-905d-4478f36053fe	b58c104e-2e12-4801-9c30-6d97228c8b79	35660cc6-d186-4b87-9c97-3c07bbc5303f	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:09.111	gm
0815e6fc-14bc-4b18-9295-a83ee6feee2c	b58c104e-2e12-4801-9c30-6d97228c8b79	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.112	gm
9dd45ffe-5ac9-4473-abff-d18db2af7c61	b58c104e-2e12-4801-9c30-6d97228c8b79	c623d1cc-09b3-48ae-96c1-e996053ab84a	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.112	gm
858a8e4e-d7c8-4461-9cfa-88c24b201c2e	b58c104e-2e12-4801-9c30-6d97228c8b79	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.113	gm
030414a2-24d6-4725-980e-106e11382d77	b58c104e-2e12-4801-9c30-6d97228c8b79	be7965d2-e7ae-42dd-9731-b1195135005e	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.114	gm
c7b5d65a-1051-4aa1-92c4-ec21f879c68b	b58c104e-2e12-4801-9c30-6d97228c8b79	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:09.115	kg
30098c7e-a79e-48c3-8e88-bf81b084799b	62b4767d-8433-40fe-bcfb-dd25bf757fa7	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.137	gm
9ff154c1-6e6e-4c22-b604-4e4e79e61045	62b4767d-8433-40fe-bcfb-dd25bf757fa7	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.138	gm
8892bc7e-7ff6-436e-b721-a7b2b0b2a1af	0ac618c0-cdd7-438e-ae36-7c2038a6bc74	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.158	gm
f50b84fe-cffd-488f-af35-c4c0d178fb6f	0ac618c0-cdd7-438e-ae36-7c2038a6bc74	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.16	gm
e31f37ff-4c2d-4481-889f-0626af22c4c1	0ac618c0-cdd7-438e-ae36-7c2038a6bc74	7687b526-7d4f-40e5-b274-c66cca337009	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.161	gm
8f2aea6f-32e5-4bbb-81ef-2fcf3a3a67f6	0ac618c0-cdd7-438e-ae36-7c2038a6bc74	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.162	gm
abd2f824-9095-49f0-9f3c-9ab8e121c672	0ac618c0-cdd7-438e-ae36-7c2038a6bc74	43f5ae1c-ecad-4e22-9825-712dde5d647e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:09.163	gm
273b616f-3295-456e-8af1-48ca9490a8be	0ac618c0-cdd7-438e-ae36-7c2038a6bc74	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.164	gm
1798dc27-5ec9-49d5-bed8-2206e9580148	69aa92c7-eaa5-4ee7-9c76-d1fbb1e0f12a	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	13.00	13.00	250	52.00	1000	13.00	2025-09-27 15:42:09.189	gm
e2ffd040-db72-466f-940c-e74406f40b9a	69aa92c7-eaa5-4ee7-9c76-d1fbb1e0f12a	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.191	gm
e44f312f-59fb-41de-a4a2-502a0d233fba	69aa92c7-eaa5-4ee7-9c76-d1fbb1e0f12a	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.192	gm
7188d00d-9f2d-48cd-8774-091f3f36affc	69aa92c7-eaa5-4ee7-9c76-d1fbb1e0f12a	cba9a138-b913-47df-b1fa-61663c7603b0	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:09.193	kg
e3aa3fae-d27b-4ce9-bb6e-ba30fd73f6b6	69aa92c7-eaa5-4ee7-9c76-d1fbb1e0f12a	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.194	gm
3552dc4b-5105-4cb6-b806-627797ed32de	69aa92c7-eaa5-4ee7-9c76-d1fbb1e0f12a	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:09.195	pc
611c6c97-551e-4f39-a045-5a316128acb5	69aa92c7-eaa5-4ee7-9c76-d1fbb1e0f12a	be7965d2-e7ae-42dd-9731-b1195135005e	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.195	gm
b78375d0-12df-4e81-80a0-216f7fca7097	69aa92c7-eaa5-4ee7-9c76-d1fbb1e0f12a	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:09.196	gm
2ddcc1e1-36a3-4141-a8f8-daaaca882064	69aa92c7-eaa5-4ee7-9c76-d1fbb1e0f12a	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:09.197	gm
93767a0f-06dc-4050-9a9a-b1802028f52c	69aa92c7-eaa5-4ee7-9c76-d1fbb1e0f12a	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.197	gm
07a1bdeb-4430-48af-944c-a424b118aa1e	07f798f8-1089-4701-ace2-6729cc308eb7	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.217	gm
b6608f8f-63d5-45ff-8316-c8ffef33a470	07f798f8-1089-4701-ace2-6729cc308eb7	be7965d2-e7ae-42dd-9731-b1195135005e	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.22	gm
0795f018-61d2-4db4-975a-2d9671621555	07f798f8-1089-4701-ace2-6729cc308eb7	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:09.221	gm
ee6c330c-81e0-4e80-bcf7-445108dfbb9f	07f798f8-1089-4701-ace2-6729cc308eb7	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	100	8.00	8.00	100	80.00	1000	8.00	2025-09-27 15:42:09.222	gm
0a2b3bbd-4ecf-433f-bda1-709ca3a91dc3	9cb75236-6396-4911-8706-b5de3daad2f8	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:09.242	gm
b2072cb7-170f-4795-a6b1-a0610a8abce8	9cb75236-6396-4911-8706-b5de3daad2f8	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.244	gm
134623f5-246e-4acb-b32f-646e2dc002e8	9cb75236-6396-4911-8706-b5de3daad2f8	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:09.245	gm
875d2823-65fc-4c47-955f-7d92a913015f	9cb75236-6396-4911-8706-b5de3daad2f8	2eae0636-1fa4-4d47-855f-306125787b1e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.246	gm
f4fa210d-94e7-4bf9-b774-f424654d5889	9cb75236-6396-4911-8706-b5de3daad2f8	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	1	50.00	0.05	1	50.00	1000	0.05	2025-09-27 15:42:09.247	kg
98b371fc-2e60-40ea-be77-cc08f36176c6	9cb75236-6396-4911-8706-b5de3daad2f8	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.248	gm
f0e53622-d324-4a80-8e27-6af664b3cdd9	9cb75236-6396-4911-8706-b5de3daad2f8	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.248	gm
0ac04eb2-d629-47f8-b6d6-36f576b1c8ef	9cb75236-6396-4911-8706-b5de3daad2f8	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:09.249	gm
a91d8ec5-c26c-4b4a-b589-b385343355f2	9cb75236-6396-4911-8706-b5de3daad2f8	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.25	gm
346029f6-7136-4fb0-be95-dbcc85351731	9cb75236-6396-4911-8706-b5de3daad2f8	97d66b60-b3da-41f0-a6b0-305cbb2fb464	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.25	gm
25e01a18-e8c4-48d6-8ac3-65690c61f4dc	9cb75236-6396-4911-8706-b5de3daad2f8	be7965d2-e7ae-42dd-9731-b1195135005e	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.252	gm
7f42ee86-48b9-41e2-affe-dac233d48824	9cb75236-6396-4911-8706-b5de3daad2f8	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:09.252	kg
0d9634e9-2c49-44d2-b025-d32fe54ad217	3d2be6c4-9c87-4b52-93fa-b7194cfbf831	c623d1cc-09b3-48ae-96c1-e996053ab84a	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.277	gm
9ab1571f-6e26-49cf-b73a-66618d0aaea7	3d2be6c4-9c87-4b52-93fa-b7194cfbf831	be7965d2-e7ae-42dd-9731-b1195135005e	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.28	gm
9ce0f2db-fc6b-44a4-a817-4bc410fdf4a9	3d2be6c4-9c87-4b52-93fa-b7194cfbf831	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:09.281	gm
f5c9bdf7-cd8f-4b06-a1ce-2871dc641ea3	3d2be6c4-9c87-4b52-93fa-b7194cfbf831	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:09.281	gm
ce186a7e-13f8-4f1b-8b17-a8f8a17ac889	3d2be6c4-9c87-4b52-93fa-b7194cfbf831	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.282	gm
d77cee5e-d8b1-4269-b357-6af9ac57f31b	bdee3fdf-84fe-449b-8573-9a377bdff650	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:09.301	kg
1b949491-1fc2-4906-8068-a055e0510c61	bdee3fdf-84fe-449b-8573-9a377bdff650	be7965d2-e7ae-42dd-9731-b1195135005e	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.303	gm
734d48bb-63cf-4ac3-93db-2b84cd19b8f8	bdee3fdf-84fe-449b-8573-9a377bdff650	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:09.304	gm
f79fc120-f2af-4259-90fb-ebad31008022	bdee3fdf-84fe-449b-8573-9a377bdff650	2eae0636-1fa4-4d47-855f-306125787b1e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.305	gm
9571bba7-aef1-4057-aa93-f62e49a0771e	bdee3fdf-84fe-449b-8573-9a377bdff650	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.306	gm
4698a18a-1da8-4bea-bea7-6c2d1fa80a0d	bdee3fdf-84fe-449b-8573-9a377bdff650	43f5ae1c-ecad-4e22-9825-712dde5d647e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:09.307	gm
2183e3e7-f942-4dc3-a72a-187ce6d2d6c3	32c83fbe-a364-4b30-b6c7-ab6826e34ed1	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:09.326	gm
7a569e93-f56b-488e-97cf-b97fd7bb9f5d	32c83fbe-a364-4b30-b6c7-ab6826e34ed1	be7965d2-e7ae-42dd-9731-b1195135005e	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.329	gm
a1e3acf4-b69d-4509-befd-58bc26f4109b	32c83fbe-a364-4b30-b6c7-ab6826e34ed1	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:09.333	gm
d55d87cd-dd81-4bbf-b0f8-d4f1855f8a08	32c83fbe-a364-4b30-b6c7-ab6826e34ed1	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.336	gm
dfb51729-7414-4cd8-b6ef-33af39ce3824	32c83fbe-a364-4b30-b6c7-ab6826e34ed1	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.341	gm
e41e89d9-6f28-4dde-94ad-5fce7efe8049	4e15bbce-85ad-467d-8f1f-6113d148bb96	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.373	gm
cb8e2303-f98c-4b7b-8223-85876dcd7195	4e15bbce-85ad-467d-8f1f-6113d148bb96	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.38	gm
837c5de2-146f-4c79-870c-e4c465981cff	4e15bbce-85ad-467d-8f1f-6113d148bb96	be7965d2-e7ae-42dd-9731-b1195135005e	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.383	gm
435e83dc-6216-41a9-b15c-923ab5b28505	4e15bbce-85ad-467d-8f1f-6113d148bb96	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.386	gm
ffc778f3-0fd6-4a51-b0bb-964625206adb	4e15bbce-85ad-467d-8f1f-6113d148bb96	7fded13b-5795-4f23-a8ba-c1c830755b18	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.388	gm
47ee5667-dbfe-4e54-906e-8a809f1c01be	7aa449e4-1f8e-4de9-9ee4-24eda6513f16	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:09.414	gm
433ada24-c493-4bc3-9bc3-fb86afaab5a6	7aa449e4-1f8e-4de9-9ee4-24eda6513f16	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.415	gm
46e58345-577c-4c65-9f0d-62b3ad3b455b	7aa449e4-1f8e-4de9-9ee4-24eda6513f16	be7965d2-e7ae-42dd-9731-b1195135005e	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.415	gm
4c0a5cf3-e723-4e07-92bf-ae0390b33397	2ed1f8c5-9c24-467b-93da-4c741716b627	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.436	gm
c4741ab9-2a08-46e1-bcb3-738ec972de73	2ed1f8c5-9c24-467b-93da-4c741716b627	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:09.437	gm
c0e159a9-46c2-41ea-91c0-635f160637ca	2ed1f8c5-9c24-467b-93da-4c741716b627	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.438	gm
3b482b6b-e865-49ee-bf49-4b00312d40dd	2ed1f8c5-9c24-467b-93da-4c741716b627	cba9a138-b913-47df-b1fa-61663c7603b0	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.438	gm
4c821aeb-32bc-43a6-8e81-27d6e152bc46	2ed1f8c5-9c24-467b-93da-4c741716b627	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.439	gm
2ac332a7-ac64-4350-bc4c-c5984e8ef1c9	2ed1f8c5-9c24-467b-93da-4c741716b627	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.439	gm
ac3ca13a-9ca0-4e72-b568-30bb4c828beb	2ed1f8c5-9c24-467b-93da-4c741716b627	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:09.439	gm
a71fd357-160b-497f-9bfb-147eb955b5f3	2ed1f8c5-9c24-467b-93da-4c741716b627	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.44	gm
910616d1-7ddd-4f59-9c9a-4a573764cbbd	2ed1f8c5-9c24-467b-93da-4c741716b627	738a0900-9798-424c-a3f6-04a98bcf3848	500	15.00	15.00	500	30.00	1000	15.00	2025-09-27 15:42:09.44	gm
f4379415-ba13-451c-9456-1500d60fb4d4	16ae549d-a7ba-4ca3-9ca0-b50056a90135	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.461	gm
8da592c5-c2ed-48ad-9340-d82a14f233b8	16ae549d-a7ba-4ca3-9ca0-b50056a90135	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:09.462	gm
67c502d3-2159-4510-b0c0-3f42368d9cc7	16ae549d-a7ba-4ca3-9ca0-b50056a90135	cba9a138-b913-47df-b1fa-61663c7603b0	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.462	gm
378f0c02-4117-4f0e-be14-4a099084625d	16ae549d-a7ba-4ca3-9ca0-b50056a90135	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.463	gm
b2c79a68-c4e4-4f1e-894f-d5a8946f1ecd	16ae549d-a7ba-4ca3-9ca0-b50056a90135	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:09.463	pc
0663a486-0b25-45cc-a97e-7e3e72255790	f54420dc-b4f1-4a4c-9306-901a11368483	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.481	gm
900ae69a-323c-4158-aafb-449c15321e54	f54420dc-b4f1-4a4c-9306-901a11368483	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.482	gm
ed9f2fab-e2ab-4a9b-982c-3e2edfa3947a	f54420dc-b4f1-4a4c-9306-901a11368483	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:09.483	gm
87c20c14-c89d-43f4-ac3d-584c5ac9e6b5	f54420dc-b4f1-4a4c-9306-901a11368483	6c1e3d72-7d97-40bb-97b4-93059631140f	1	15.00	15.00	1	15.00	1	15.00	2025-09-27 15:42:09.483	pc
05ba34c0-b28d-4c45-a292-351a7def1e76	f54420dc-b4f1-4a4c-9306-901a11368483	7687b526-7d4f-40e5-b274-c66cca337009	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.483	gm
e43e0470-c1f5-493e-880d-9b3ba8260e34	26c9c757-3b39-4034-bb9c-3c8cb45d77a5	738a0900-9798-424c-a3f6-04a98bcf3848	2	60.00	0.12	2	60.00	1000	0.12	2025-09-27 15:42:09.505	kg
752057d3-c85b-4c34-85df-1ebf3cf87eeb	26c9c757-3b39-4034-bb9c-3c8cb45d77a5	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.507	gm
fb80aec4-6b9f-4ef5-b1f0-ab1961b11f13	26c9c757-3b39-4034-bb9c-3c8cb45d77a5	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.508	gm
141bbd3e-943b-4929-8d4a-984607e910b4	26c9c757-3b39-4034-bb9c-3c8cb45d77a5	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:09.509	gm
fe84076e-ff49-42be-b68b-818b5e944303	26c9c757-3b39-4034-bb9c-3c8cb45d77a5	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.51	gm
4f640fe2-a183-44d4-a162-fe76d02b3dfb	26c9c757-3b39-4034-bb9c-3c8cb45d77a5	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.511	gm
0c871942-46c0-4d61-b924-062d93a0ddf5	26c9c757-3b39-4034-bb9c-3c8cb45d77a5	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.511	gm
f45062fe-6d9d-4ff0-9d17-0df4c9b76cf6	26c9c757-3b39-4034-bb9c-3c8cb45d77a5	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:09.512	gm
171fad2a-9c5b-4bb5-8eff-08449c33fdaa	26c9c757-3b39-4034-bb9c-3c8cb45d77a5	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:09.513	gm
83766c2b-bd00-41dc-aa75-f0d971f1b678	8816c271-ac91-4f6f-a30f-7d0da0d68c66	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	60.00	60.00	1	60.00	1000	60.00	2025-09-27 15:42:09.534	kg
5385dfe1-61ff-4e8a-9695-90d14ebf8362	8816c271-ac91-4f6f-a30f-7d0da0d68c66	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.536	gm
b8221721-7853-4eb8-bd68-42e112f3d75d	8816c271-ac91-4f6f-a30f-7d0da0d68c66	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.536	gm
63b2fc1d-0eae-47e7-ad46-c582c5f9ebd3	8816c271-ac91-4f6f-a30f-7d0da0d68c66	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.537	gm
94e997a0-9bce-4892-ade6-30e4de115d7b	8816c271-ac91-4f6f-a30f-7d0da0d68c66	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.538	gm
04809a39-c699-4795-95d1-20d5a5cc7880	8816c271-ac91-4f6f-a30f-7d0da0d68c66	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.538	gm
c692ee1f-578f-45c8-9b32-3af2e7f897b3	ef6a7f78-5b94-4c82-8a45-c083b343b655	738a0900-9798-424c-a3f6-04a98bcf3848	2	60.00	0.12	2	60.00	1000	0.12	2025-09-27 15:42:09.559	kg
3b4b8ca2-4707-4feb-b62a-5a988628952e	ef6a7f78-5b94-4c82-8a45-c083b343b655	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.562	gm
f51eddb4-203a-4424-a282-176fe73ac262	ef6a7f78-5b94-4c82-8a45-c083b343b655	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.563	gm
29d6fb26-4a23-47f3-b7a0-c844aa9f6416	ef6a7f78-5b94-4c82-8a45-c083b343b655	be7965d2-e7ae-42dd-9731-b1195135005e	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.564	gm
e1061072-344f-49b3-bfe0-236f5a949af1	ef6a7f78-5b94-4c82-8a45-c083b343b655	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	200	30.00	30.00	200	150.00	1000	30.00	2025-09-27 15:42:09.564	gm
c92fd1df-1d9a-41f5-a927-42b795aa5f96	ef6a7f78-5b94-4c82-8a45-c083b343b655	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.565	gm
551206be-3b49-48c3-9ac2-2d8c6b618ced	ef6a7f78-5b94-4c82-8a45-c083b343b655	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.566	gm
a4f5d9af-1666-4099-a0bf-0e481ae5dd61	ef6a7f78-5b94-4c82-8a45-c083b343b655	7fded13b-5795-4f23-a8ba-c1c830755b18	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.566	gm
9e1747a4-cee0-4425-a65c-35a45e7b9d90	ef6a7f78-5b94-4c82-8a45-c083b343b655	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.567	gm
60dcebd5-fe87-4164-a97e-69d9798d730e	ef6a7f78-5b94-4c82-8a45-c083b343b655	97d66b60-b3da-41f0-a6b0-305cbb2fb464	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.567	gm
9cfdb012-5926-4a87-92e5-6947355b5278	4435447d-453e-4683-a9d5-d079c7298148	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:09.585	kg
74a4f8ee-81f2-4565-9072-89ec49990ffc	4435447d-453e-4683-a9d5-d079c7298148	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.586	gm
6c2ed17f-2b4a-4671-b937-821ab26a85f0	4435447d-453e-4683-a9d5-d079c7298148	2eae0636-1fa4-4d47-855f-306125787b1e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.587	gm
c40c534e-a7fc-41c0-9c38-529d77d7527c	d2294a03-f04c-4e74-9123-4342f0a9e4e5	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:09.607	kg
7a121300-a795-49d1-8ada-066883af059c	d2294a03-f04c-4e74-9123-4342f0a9e4e5	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.61	gm
7fe0f38e-875d-40ff-9627-cbca95cb8e1b	d2294a03-f04c-4e74-9123-4342f0a9e4e5	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.611	gm
6c6a5d4a-553c-4bac-9e01-5ef441876c98	d2294a03-f04c-4e74-9123-4342f0a9e4e5	7fded13b-5795-4f23-a8ba-c1c830755b18	200	14.00	14.00	200	70.00	1000	14.00	2025-09-27 15:42:09.612	gm
42799449-3e6a-4336-885d-9ff6184b669b	d2294a03-f04c-4e74-9123-4342f0a9e4e5	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	200	16.00	16.00	200	80.00	1000	16.00	2025-09-27 15:42:09.612	gm
3f4f092d-747e-4dfc-887e-6ad1bf152204	d2294a03-f04c-4e74-9123-4342f0a9e4e5	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.613	gm
f8ea8603-9667-482d-b816-d54d5a31c9ae	66bec82a-e572-453c-8512-d1d5a1fd65f2	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.653	gm
412a7980-2f98-48e2-b6d3-993fa3a40b92	66bec82a-e572-453c-8512-d1d5a1fd65f2	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.656	gm
d897d0ef-1e37-40df-ba98-6ab5b93efe62	66bec82a-e572-453c-8512-d1d5a1fd65f2	97d66b60-b3da-41f0-a6b0-305cbb2fb464	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.657	gm
ebfb240e-85b9-4af2-ae56-1b434e06e968	66bec82a-e572-453c-8512-d1d5a1fd65f2	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.658	gm
0ed7ae62-923a-4287-8bac-40d9ef0c5311	a76335be-6f19-41db-bc70-5d587c420e5e	7fded13b-5795-4f23-a8ba-c1c830755b18	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.682	gm
99bbe32b-2cea-454e-826c-cacb58f14ed9	a76335be-6f19-41db-bc70-5d587c420e5e	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	13.00	13.00	250	52.00	1000	13.00	2025-09-27 15:42:09.685	gm
847aba53-766d-4285-8d2e-c1904452cf40	a76335be-6f19-41db-bc70-5d587c420e5e	c623d1cc-09b3-48ae-96c1-e996053ab84a	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.686	gm
82db8f6a-eaf7-4455-8d23-46ccf4ad4836	a76335be-6f19-41db-bc70-5d587c420e5e	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.687	gm
1d44b3ac-a3eb-488b-8718-45a5309f0019	a76335be-6f19-41db-bc70-5d587c420e5e	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.688	gm
c7a46f37-45d0-42b8-9507-9ac3b30493ec	a76335be-6f19-41db-bc70-5d587c420e5e	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:09.688	gm
4bb0abc1-6063-4937-aeb7-18ba5912099f	71210f59-d9e0-43c8-927b-7219c4dd9580	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.709	gm
8b02d8a3-ed27-46b9-a7dc-5170fa560298	71210f59-d9e0-43c8-927b-7219c4dd9580	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:09.712	gm
00f2af65-1387-4897-85e0-a5cafff13c90	71210f59-d9e0-43c8-927b-7219c4dd9580	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.713	gm
67de3df6-e640-42a2-8494-b3a3ec21d03b	809a1a6c-a19c-4d65-89a8-fa9b005b9297	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:09.743	gm
583b0a53-02b7-4a1f-a99c-602974d48f5b	809a1a6c-a19c-4d65-89a8-fa9b005b9297	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.746	gm
86ff6354-daae-4712-ba89-2fd22ad6e23a	809a1a6c-a19c-4d65-89a8-fa9b005b9297	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.747	gm
8042b833-fd81-4ca4-ab58-7984d119077f	0c426b8e-27c2-4e6b-96a0-b978408bd043	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.766	gm
1256a272-073c-41aa-a80a-00c87f9ac9c2	0c426b8e-27c2-4e6b-96a0-b978408bd043	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.768	gm
7fca19df-216d-429f-ad86-74c99329db01	0c426b8e-27c2-4e6b-96a0-b978408bd043	2eae0636-1fa4-4d47-855f-306125787b1e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.769	gm
890669f7-f7cc-4551-9f94-2e7523568305	0c426b8e-27c2-4e6b-96a0-b978408bd043	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.77	gm
a68f6514-e6ab-414a-b25c-14aa618c37eb	0c426b8e-27c2-4e6b-96a0-b978408bd043	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.771	gm
5d7b8fba-073a-4d31-859b-1be4eb0f3886	0c426b8e-27c2-4e6b-96a0-b978408bd043	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.772	gm
b572b7f7-7d95-41ca-b590-21565d240f77	495c36e3-9b48-499c-93dd-cf19cea35bc0	7687b526-7d4f-40e5-b274-c66cca337009	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.793	gm
180afe04-c7a6-4c95-aff1-5ebeeaff97f9	495c36e3-9b48-499c-93dd-cf19cea35bc0	2eae0636-1fa4-4d47-855f-306125787b1e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.795	gm
70b528d6-cc28-4049-82af-400c61b4ea7c	495c36e3-9b48-499c-93dd-cf19cea35bc0	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.796	gm
f5817f4c-2966-4883-b26c-f402bbc94867	db80cec6-b816-41c0-887c-762ec7a3ecf6	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:09.817	kg
bd75ea8d-7e7e-4b69-910d-da397bc41d5e	db80cec6-b816-41c0-887c-762ec7a3ecf6	cba9a138-b913-47df-b1fa-61663c7603b0	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:09.82	kg
03e07a1d-6acf-4e4e-8978-431d3ac43d23	db80cec6-b816-41c0-887c-762ec7a3ecf6	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.822	gm
36ad332f-9fcc-4613-9043-a3036c91175a	db80cec6-b816-41c0-887c-762ec7a3ecf6	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.822	gm
22adaf00-eb02-4adb-b689-1a05e305429f	db80cec6-b816-41c0-887c-762ec7a3ecf6	be7965d2-e7ae-42dd-9731-b1195135005e	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.823	gm
3150fcc1-ba92-45d7-8c8b-56acf4020ff5	db80cec6-b816-41c0-887c-762ec7a3ecf6	2eae0636-1fa4-4d47-855f-306125787b1e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.824	gm
56f230d2-b766-4aa4-bf88-ae06abc21853	db80cec6-b816-41c0-887c-762ec7a3ecf6	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	300	30.00	30.00	300	100.00	1000	30.00	2025-09-27 15:42:09.825	gm
6351f87d-a35a-4897-b78a-2fe6bfb5a9f6	db80cec6-b816-41c0-887c-762ec7a3ecf6	35660cc6-d186-4b87-9c97-3c07bbc5303f	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:09.826	gm
8f0f57b0-c6aa-441c-b031-31aa1222bbc0	b5c68a8f-821b-4b92-8f9c-88372dac0d13	97d66b60-b3da-41f0-a6b0-305cbb2fb464	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.847	gm
e4d8f5c2-1d37-484f-9bdb-8a8a622060cd	b5c68a8f-821b-4b92-8f9c-88372dac0d13	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:09.849	gm
d2f3bf12-4303-4c70-be9c-ae9602dee778	61785ee4-466b-414b-8253-048fb0d63f25	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:09.88	gm
12783558-912f-4a70-9a1a-b4ee77bbcbf9	61785ee4-466b-414b-8253-048fb0d63f25	be7965d2-e7ae-42dd-9731-b1195135005e	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:09.883	gm
a7cd2f45-c6f7-4fdd-b518-73c9ed9e3776	23abb815-d971-465f-92de-d13cb9fe71b5	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.905	gm
be70b524-b50f-461a-afa1-00552823ad1d	23abb815-d971-465f-92de-d13cb9fe71b5	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.907	gm
ca8a30b5-298e-4209-b287-1b7cd9329fab	23abb815-d971-465f-92de-d13cb9fe71b5	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:09.908	gm
ca428492-9f01-4043-b471-f4d07d7f5d13	6ee50630-a12c-4ad6-b5ac-2b49aeaa0f45	cba9a138-b913-47df-b1fa-61663c7603b0	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:09.929	kg
0a41da36-74aa-4480-befb-c276b73623cb	6ee50630-a12c-4ad6-b5ac-2b49aeaa0f45	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	13.00	13.00	250	52.00	1000	13.00	2025-09-27 15:42:09.931	gm
1c403dda-94fd-4688-9ae9-cad86a03abab	6ee50630-a12c-4ad6-b5ac-2b49aeaa0f45	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.932	gm
90876345-5450-40c3-a07c-857a272be8eb	6ee50630-a12c-4ad6-b5ac-2b49aeaa0f45	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	1	50.00	0.05	1	50.00	1000	0.05	2025-09-27 15:42:09.933	kg
4b08c94e-5e2d-495c-b2af-331068ce58a5	6ee50630-a12c-4ad6-b5ac-2b49aeaa0f45	97d66b60-b3da-41f0-a6b0-305cbb2fb464	1	70.00	0.07	1	70.00	1000	0.07	2025-09-27 15:42:09.934	kg
c14ff3b3-88c5-4cb6-9a28-0e80240336e3	9f0eb33e-17cb-4788-9b28-a13c463449e1	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:09.954	gm
293963cc-3c14-4c04-b42a-70ef4975c987	9f0eb33e-17cb-4788-9b28-a13c463449e1	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	300	18.00	18.00	300	60.00	1000	18.00	2025-09-27 15:42:09.957	gm
202e2347-3f41-4a87-ab48-be096234660a	9f0eb33e-17cb-4788-9b28-a13c463449e1	cba9a138-b913-47df-b1fa-61663c7603b0	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.958	gm
7b23cc68-3200-43b2-9e1e-9164c33b7003	9f0eb33e-17cb-4788-9b28-a13c463449e1	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.959	gm
d2bb399f-a660-4865-9f7a-0e9c7cf2d4ef	9f0eb33e-17cb-4788-9b28-a13c463449e1	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	250	13.00	13.00	250	52.00	1000	13.00	2025-09-27 15:42:09.96	gm
27bace0e-5633-4cfb-9c47-187e8c5e8fc8	9f0eb33e-17cb-4788-9b28-a13c463449e1	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:09.96	gm
ef0466c6-5314-4e33-861c-1e33c4ceb2e2	9f0eb33e-17cb-4788-9b28-a13c463449e1	738a0900-9798-424c-a3f6-04a98bcf3848	2	60.00	0.12	2	60.00	1000	0.12	2025-09-27 15:42:09.961	kg
2261ebca-aee6-45eb-a195-fec0baae32ea	9f0eb33e-17cb-4788-9b28-a13c463449e1	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:09.962	gm
456d155f-0283-4438-b331-41f25c3fd4c6	573dd109-a104-4222-b4ad-2aa7f227aebb	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:09.987	kg
5c4bb904-1dbc-4593-b899-1ec5646a37e9	573dd109-a104-4222-b4ad-2aa7f227aebb	2eae0636-1fa4-4d47-855f-306125787b1e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:09.988	gm
b5d27c85-5789-443d-be0f-2229a3cae695	573dd109-a104-4222-b4ad-2aa7f227aebb	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:09.989	gm
dd4a62be-c078-481b-8a5f-347fdbf1b3d6	573dd109-a104-4222-b4ad-2aa7f227aebb	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:09.99	gm
6976f93c-20d5-45cf-ba01-12e7dc36a0f4	573dd109-a104-4222-b4ad-2aa7f227aebb	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:09.991	gm
688e1b85-ec27-4789-961e-e53d73e2c318	a6d963ae-a8c9-4d72-ad48-e81c0c0950bd	35660cc6-d186-4b87-9c97-3c07bbc5303f	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:10.014	gm
5eaa2d18-347e-4ece-9dc1-1cf516b44569	a6d963ae-a8c9-4d72-ad48-e81c0c0950bd	682089ef-89e9-4860-bfe0-e286ada294dd	1	60.00	0.06	1	60.00	1000	0.06	2025-09-27 15:42:10.016	kg
a8dc4e37-955e-4b43-938f-0f1fbf07a549	a6d963ae-a8c9-4d72-ad48-e81c0c0950bd	be7965d2-e7ae-42dd-9731-b1195135005e	1	70.00	0.07	1	70.00	1000	0.07	2025-09-27 15:42:10.018	kg
23f8777a-d6b9-44b6-a8f2-5c6ddd8318ba	a6d963ae-a8c9-4d72-ad48-e81c0c0950bd	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	1	50.00	0.05	1	50.00	1000	0.05	2025-09-27 15:42:10.019	kg
52ffe69f-2152-4355-87b0-bccfbb554811	a6d963ae-a8c9-4d72-ad48-e81c0c0950bd	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:10.02	gm
b3138bdf-ff64-4053-91b9-32e12b0612bf	a6d963ae-a8c9-4d72-ad48-e81c0c0950bd	2eae0636-1fa4-4d47-855f-306125787b1e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:10.021	gm
aba20399-09b8-477c-bffd-86b979ec480b	a6d963ae-a8c9-4d72-ad48-e81c0c0950bd	c623d1cc-09b3-48ae-96c1-e996053ab84a	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:10.021	gm
4c30d6ad-82b8-4193-bead-f59a19e0642c	a6d963ae-a8c9-4d72-ad48-e81c0c0950bd	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:10.022	gm
0cf72edd-13d4-4b5e-bae6-0767685d923b	72305b9c-d208-4480-a808-c00bb3cf11d9	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:10.041	gm
da45a730-a5a1-4b93-b792-73634e520e38	72305b9c-d208-4480-a808-c00bb3cf11d9	7fded13b-5795-4f23-a8ba-c1c830755b18	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:10.043	gm
b39e72d7-ca3f-4b6d-888e-9b2bb7c1a18c	655e4279-48ca-4d17-8d49-7ad26d1481f1	0653ab92-5171-418b-89d2-9e6b60482bbb	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:10.07	gm
e9204a22-7768-42e4-9cb7-4af42b7db3d3	655e4279-48ca-4d17-8d49-7ad26d1481f1	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:10.073	gm
da173bb3-75ef-4907-ab4c-052644ba4295	655e4279-48ca-4d17-8d49-7ad26d1481f1	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:10.074	gm
e70836f7-e451-4343-9758-e835b3194a6a	655e4279-48ca-4d17-8d49-7ad26d1481f1	7fded13b-5795-4f23-a8ba-c1c830755b18	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:10.075	gm
695ea94f-f29c-4b7e-af0f-6e8f28362aef	655e4279-48ca-4d17-8d49-7ad26d1481f1	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:10.076	kg
de633ee7-16ad-4ce0-8c3b-456994c0cf06	429e940e-a5f7-4d90-9f67-529e70274c6a	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	60.00	60.00	1	60.00	1000	60.00	2025-09-27 15:42:10.097	kg
3c053a0f-0c9b-4ef3-a975-901cc0fd3f9d	98e9c093-283c-4902-aa56-9f6793428f67	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:10.121	gm
2679aaae-d59e-4359-a860-f324c9fc9a4b	98e9c093-283c-4902-aa56-9f6793428f67	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:10.123	gm
f4de5aed-3908-4b56-bb73-11db44e62daf	45b8a7ab-d6eb-40d3-93b3-08ee67324a85	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:10.165	kg
455c259a-56c0-4e0a-9e4a-89a7fed7f09a	45b8a7ab-d6eb-40d3-93b3-08ee67324a85	0653ab92-5171-418b-89d2-9e6b60482bbb	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:10.168	gm
9005bfd0-0fce-4df3-9389-64857e247d16	45b8a7ab-d6eb-40d3-93b3-08ee67324a85	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:10.17	gm
23b4be4f-22db-405f-9d4f-99ccce649ee4	45b8a7ab-d6eb-40d3-93b3-08ee67324a85	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:10.171	gm
34afa877-a5af-48df-8da4-6c5204030ba6	45b8a7ab-d6eb-40d3-93b3-08ee67324a85	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:10.172	gm
b10b4da5-49b9-449a-8a9e-ee3447642a6c	4f84144c-3b8c-411f-b5bc-9d0f7c73a5ab	cba9a138-b913-47df-b1fa-61663c7603b0	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:10.211	gm
cd22dc05-d42d-4cd1-872b-3bda8c27a26c	4f84144c-3b8c-411f-b5bc-9d0f7c73a5ab	2eae0636-1fa4-4d47-855f-306125787b1e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:10.213	gm
338c5462-79c7-4b12-a8ed-a47b429481d4	da998aee-c31d-4ee7-ab17-797394c85ccf	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:10.233	kg
52f5da26-69c2-402a-b4be-fa30a13cda36	da998aee-c31d-4ee7-ab17-797394c85ccf	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:10.236	gm
3f48a050-390a-498a-87c1-020a91cf5e4c	da998aee-c31d-4ee7-ab17-797394c85ccf	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:10.238	gm
75ee6ad7-8205-41cf-afef-f04655bd5f70	da998aee-c31d-4ee7-ab17-797394c85ccf	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:10.238	gm
cc54570d-b957-46cc-9a7a-83a195d9e6fa	b92f776f-65e5-4ad7-8050-f1f5ebea412c	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:10.257	gm
326f308f-c98c-4e51-a642-2dafaf885084	b92f776f-65e5-4ad7-8050-f1f5ebea412c	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	13.00	13.00	250	52.00	1000	13.00	2025-09-27 15:42:10.26	gm
b4c6d5da-6f89-4c2d-9e9e-49bdccdcb3fc	6f8752d2-3200-4a18-9ee9-04023301a844	7fded13b-5795-4f23-a8ba-c1c830755b18	100	7.00	7.00	100	70.00	1000	7.00	2025-09-27 15:42:10.281	gm
b82650e5-39de-4c06-a7fe-605dc4ec7fd3	6f8752d2-3200-4a18-9ee9-04023301a844	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	28.00	28.00	250	112.00	1000	28.00	2025-09-27 15:42:10.284	gm
11882e35-02a1-46db-90cc-21f5d5bd9123	6f8752d2-3200-4a18-9ee9-04023301a844	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:10.285	gm
eb04cb75-c364-4b72-b316-fc078c9b3d10	6f8752d2-3200-4a18-9ee9-04023301a844	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:10.286	gm
72d85f58-d625-4611-a7de-a764aeb7354e	6f8752d2-3200-4a18-9ee9-04023301a844	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:10.287	gm
eb5a5097-5348-4c82-b83c-d9f24f3234f4	6f8752d2-3200-4a18-9ee9-04023301a844	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:10.288	gm
7cfb089e-ac37-42cd-9b34-12734c4fca00	6f8752d2-3200-4a18-9ee9-04023301a844	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:10.288	gm
df7944a1-ffb4-46a5-beb0-e2006e88b8f0	87b4f7ed-fd5a-449e-abb7-7cfd7e5a8e8a	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:10.314	gm
0d4d24fa-2d79-4790-a881-b5c5a1d5dffb	87b4f7ed-fd5a-449e-abb7-7cfd7e5a8e8a	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:10.316	gm
2cae29b3-20ba-4570-b9c3-a1aeda17a5a9	87b4f7ed-fd5a-449e-abb7-7cfd7e5a8e8a	97d66b60-b3da-41f0-a6b0-305cbb2fb464	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:10.318	gm
19d8af25-dd32-43c4-afb6-71d4644641cc	87b4f7ed-fd5a-449e-abb7-7cfd7e5a8e8a	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	28.00	28.00	250	112.00	1000	28.00	2025-09-27 15:42:10.318	gm
08f2840e-ae9a-4059-ba8a-ef66e6eb59fc	87b4f7ed-fd5a-449e-abb7-7cfd7e5a8e8a	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:10.319	gm
464bf460-baf4-4e99-a048-0b60ba789ea6	87b4f7ed-fd5a-449e-abb7-7cfd7e5a8e8a	7fded13b-5795-4f23-a8ba-c1c830755b18	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:10.32	gm
aed54664-e5d5-43ab-8887-6ed1fbfc9c6b	cecaa1ab-6807-4eb8-aab0-e76730785001	7fded13b-5795-4f23-a8ba-c1c830755b18	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:10.343	gm
2351b19d-9560-4dc5-b66e-aab96fba83a4	cecaa1ab-6807-4eb8-aab0-e76730785001	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:10.346	kg
01d1af99-6572-49ab-88cb-570ae6812032	cecaa1ab-6807-4eb8-aab0-e76730785001	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	28.00	28.00	250	112.00	1000	28.00	2025-09-27 15:42:10.346	gm
260502da-07da-44d8-a97c-ccd5590810a5	cecaa1ab-6807-4eb8-aab0-e76730785001	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:10.347	gm
cff2a0c5-af25-45aa-bbbb-7d7eea56be6f	7b56fc26-de77-4d5d-a5ce-35603337a085	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:10.37	gm
b1b6e070-6f0b-45c5-be43-a1570c15158d	7b56fc26-de77-4d5d-a5ce-35603337a085	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:10.372	gm
cdad05fd-f6d0-4a09-94af-71d11a735da9	7b56fc26-de77-4d5d-a5ce-35603337a085	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:10.373	gm
e356041f-8560-4a5a-930b-3e81254c5ee2	7b56fc26-de77-4d5d-a5ce-35603337a085	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:10.374	gm
c5dac5f4-4861-4bcc-afd2-46adec8f261b	7b56fc26-de77-4d5d-a5ce-35603337a085	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:10.374	gm
f8c13fc2-095d-4af8-83de-7bc1ba219179	7b56fc26-de77-4d5d-a5ce-35603337a085	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:10.375	gm
1e75f646-8a32-4214-90cb-d00ebb11fdea	7b56fc26-de77-4d5d-a5ce-35603337a085	7fded13b-5795-4f23-a8ba-c1c830755b18	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:10.376	gm
0a648c50-c1c9-4356-bf81-24ac87217523	7b56fc26-de77-4d5d-a5ce-35603337a085	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	28.00	28.00	250	112.00	1000	28.00	2025-09-27 15:42:10.377	gm
387306f0-6466-48df-b4b6-99fa08643eef	846705c1-aa4c-4657-9860-d081033f93f5	43f5ae1c-ecad-4e22-9825-712dde5d647e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:10.398	gm
aeeeb109-cf04-4eed-a5b7-1a2b55a4b792	846705c1-aa4c-4657-9860-d081033f93f5	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:10.4	gm
e5fd99cf-e423-4c0a-85af-556b4b470259	be5e531c-27df-4c0d-9f8a-2ec817c7e8a4	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:10.424	gm
fe0e1967-edb3-4dab-89a0-ac5bfadaecb2	be5e531c-27df-4c0d-9f8a-2ec817c7e8a4	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:10.426	gm
566abe5f-a9f0-4a60-8952-04e9fcf43c73	be5e531c-27df-4c0d-9f8a-2ec817c7e8a4	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:10.427	gm
97a2febf-9d95-45e6-8f34-153fb07e99d3	13bdb66a-a51f-4e30-b113-cc4f296368eb	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:10.445	gm
62e9fc35-390a-4243-b80e-5380c01365ea	13bdb66a-a51f-4e30-b113-cc4f296368eb	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:10.448	gm
050b31c4-4d9f-43d7-8afe-5e41796dc5c3	13bdb66a-a51f-4e30-b113-cc4f296368eb	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	13.00	13.00	250	52.00	1000	13.00	2025-09-27 15:42:10.449	gm
73e3c8f4-80ed-4fb1-af78-2a5d7b12a818	13bdb66a-a51f-4e30-b113-cc4f296368eb	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:10.45	gm
cf52b09f-17a2-492c-9a4c-abca337ce48f	13bdb66a-a51f-4e30-b113-cc4f296368eb	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:10.45	gm
c5dabc1b-42c3-47b8-b722-e1e9678c6ee4	13bdb66a-a51f-4e30-b113-cc4f296368eb	43f5ae1c-ecad-4e22-9825-712dde5d647e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:10.451	gm
b2f063fd-e521-47d2-b434-a4b8d6659760	13bdb66a-a51f-4e30-b113-cc4f296368eb	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:10.452	kg
2d97a8bf-a8be-4152-8ca9-5490a85e3166	13bdb66a-a51f-4e30-b113-cc4f296368eb	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:10.453	gm
09051ff1-8d00-4c16-a273-cfeacad38061	13bdb66a-a51f-4e30-b113-cc4f296368eb	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:10.454	gm
1dfaecba-72d4-4258-a0ed-314afc6085ed	13bdb66a-a51f-4e30-b113-cc4f296368eb	81ee7d10-3404-4ae2-b740-8acf875e3ba2	15	25.00	25.00	15	1.67	1	25.00	2025-09-27 15:42:10.454	pc
c819bb98-cfb1-4c49-9504-0d2e2d763f92	13bdb66a-a51f-4e30-b113-cc4f296368eb	682089ef-89e9-4860-bfe0-e286ada294dd	1	35.00	35.00	1	35.00	1	35.00	2025-09-27 15:42:10.455	pc
c99e759a-1b7c-48d2-b7c5-d66cb275d50c	f6599666-fab4-4fa4-9b6e-867be170064f	6c1e3d72-7d97-40bb-97b4-93059631140f	4	60.00	60.00	4	15.00	1	60.00	2025-09-27 15:42:10.473	pc
c984c563-d93b-4497-a1ea-b46f9af9bdd3	f6599666-fab4-4fa4-9b6e-867be170064f	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:10.475	gm
eddf914a-28ae-4b0b-b7a9-632baba21c7e	f6599666-fab4-4fa4-9b6e-867be170064f	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:10.476	kg
278ad72e-8240-471f-9608-377cd2d05dc2	f6599666-fab4-4fa4-9b6e-867be170064f	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:10.477	gm
1bd7626f-1c7b-4697-8060-0852b46b609f	f6599666-fab4-4fa4-9b6e-867be170064f	97d66b60-b3da-41f0-a6b0-305cbb2fb464	1	70.00	0.07	1	70.00	1000	0.07	2025-09-27 15:42:10.478	kg
44ca7743-11b1-4509-972c-e109a5ef643c	f6599666-fab4-4fa4-9b6e-867be170064f	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:10.479	gm
20ccb31d-934f-47e8-997d-e5e39ddeb8d0	f6599666-fab4-4fa4-9b6e-867be170064f	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	1	50.00	0.05	1	50.00	1000	0.05	2025-09-27 15:42:10.479	kg
03fb0c02-daf6-447b-8797-631e32b33465	e17b2b1e-850e-4d0d-9548-aca9f67af5c3	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:10.501	gm
49311575-0438-4a8c-88eb-32bd25d9cad8	e17b2b1e-850e-4d0d-9548-aca9f67af5c3	7fded13b-5795-4f23-a8ba-c1c830755b18	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:10.503	gm
4d049c70-17e2-4b27-b737-407b670c2785	e17b2b1e-850e-4d0d-9548-aca9f67af5c3	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:10.504	gm
8a19cfb2-eac2-4329-b18a-e492d2f4f76e	e17b2b1e-850e-4d0d-9548-aca9f67af5c3	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:10.505	gm
a37dff33-72db-432d-a6d0-151084957058	e17b2b1e-850e-4d0d-9548-aca9f67af5c3	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:10.506	gm
bc2d9af5-c6c1-4470-b8ec-d0dc6cf249d1	e17b2b1e-850e-4d0d-9548-aca9f67af5c3	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:10.507	kg
7a091345-de5d-491a-8afa-4b29dc3b90fd	1b27bc7b-1d71-4bb4-abd1-551c94da97c4	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	500	60.00	60.00	500	120.00	1000	60.00	2025-09-27 15:42:10.563	gm
13052834-a5f9-4958-9ddc-dd95450855ce	1b27bc7b-1d71-4bb4-abd1-551c94da97c4	682089ef-89e9-4860-bfe0-e286ada294dd	1	35.00	35.00	1	35.00	1	35.00	2025-09-27 15:42:10.567	pc
7f48b99a-c582-47bf-8f60-6d1179cd857a	1b27bc7b-1d71-4bb4-abd1-551c94da97c4	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:10.568	gm
da188c60-d69d-4bdd-ab81-18e1a94cf6bc	1b27bc7b-1d71-4bb4-abd1-551c94da97c4	cba9a138-b913-47df-b1fa-61663c7603b0	1500	120.00	120.00	1500	80.00	1000	120.00	2025-09-27 15:42:10.569	gm
a17992cb-7a2c-4e31-90a8-caf0be705d91	1b27bc7b-1d71-4bb4-abd1-551c94da97c4	c623d1cc-09b3-48ae-96c1-e996053ab84a	250	23.00	23.00	250	92.00	1000	23.00	2025-09-27 15:42:10.571	gm
42d9f7f6-af9e-4a66-95c6-d0f6c39244ab	1b27bc7b-1d71-4bb4-abd1-551c94da97c4	7687b526-7d4f-40e5-b274-c66cca337009	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:10.572	gm
e40a25f3-617d-4f87-b5b1-224f725c97f9	1b27bc7b-1d71-4bb4-abd1-551c94da97c4	6c1e3d72-7d97-40bb-97b4-93059631140f	1	15.00	15.00	1	15.00	1	15.00	2025-09-27 15:42:10.573	pc
f7c8a1b1-b1ef-4c14-8b5c-94e97fb6ba47	1b27bc7b-1d71-4bb4-abd1-551c94da97c4	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:10.573	gm
69ff7a4e-44f6-44bf-a9b2-64ca1623d073	1b27bc7b-1d71-4bb4-abd1-551c94da97c4	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:10.574	gm
c162ca10-1dcf-4bfc-83bc-48571e40b43a	1b27bc7b-1d71-4bb4-abd1-551c94da97c4	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:10.575	gm
3c531aeb-f2db-4878-8bea-4f939b7c1c21	1b27bc7b-1d71-4bb4-abd1-551c94da97c4	738a0900-9798-424c-a3f6-04a98bcf3848	2	60.00	0.12	2	60.00	1000	0.12	2025-09-27 15:42:10.576	kg
6a362ec7-7ba3-4468-964a-0d6d51f0d8b0	29719aa0-d2bb-42b8-bc6c-77816ce73164	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:10.613	gm
183a68ca-6c84-4d5e-a38c-e96ff7b4c9ee	29719aa0-d2bb-42b8-bc6c-77816ce73164	6c1e3d72-7d97-40bb-97b4-93059631140f	1	15.00	15.00	1	15.00	1	15.00	2025-09-27 15:42:10.616	pc
c423a7c4-5dce-4b49-ac64-37cf507cd2d2	29719aa0-d2bb-42b8-bc6c-77816ce73164	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	500	75.00	75.00	500	150.00	1000	75.00	2025-09-27 15:42:10.617	gm
b1d01df2-f4e3-40ec-aacd-19d14c2319cf	29719aa0-d2bb-42b8-bc6c-77816ce73164	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:10.618	gm
82eef3a1-12c5-406e-857f-7b5c823d86a6	29719aa0-d2bb-42b8-bc6c-77816ce73164	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:10.619	gm
1fa959e2-e3c2-4c61-95fa-a4170142f8e2	cff52a74-4fe0-4ba7-a6a0-6eb68e69879b	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:10.76	gm
40a2bbaa-f78f-49a2-b838-b8c33fb4b518	cff52a74-4fe0-4ba7-a6a0-6eb68e69879b	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:10.764	gm
fa93ef5f-d132-483d-90c4-0bb1d28fd521	cff52a74-4fe0-4ba7-a6a0-6eb68e69879b	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:10.765	pc
bdce6450-7402-4045-aed6-c46ec4450103	f840ef56-568e-4b80-9dd2-1beb8105f749	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:10.792	gm
05e4d964-44f8-48f2-9d08-259e51744154	f840ef56-568e-4b80-9dd2-1beb8105f749	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:10.795	gm
ae145d67-9f87-4624-a107-fb00c63b1f11	f840ef56-568e-4b80-9dd2-1beb8105f749	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:10.796	gm
18d895d8-a693-41d0-bedf-fea4ea0241d3	f840ef56-568e-4b80-9dd2-1beb8105f749	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:10.797	gm
c8b60b99-8d06-4bb8-a6d8-e792c3a40b9c	f840ef56-568e-4b80-9dd2-1beb8105f749	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:10.798	gm
23a96021-658c-4e65-a475-1895ec428595	f840ef56-568e-4b80-9dd2-1beb8105f749	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:10.799	gm
c8435fb8-03e8-45d6-a002-87609a9f40a3	f840ef56-568e-4b80-9dd2-1beb8105f749	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:10.8	gm
908342bd-d048-4b6c-81ba-830f623581fa	f840ef56-568e-4b80-9dd2-1beb8105f749	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:10.8	gm
13c31a61-e61b-4292-ae81-9e1dc4b6021f	eeb9ea35-5047-4c3e-ac32-eb3dd8845b07	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:10.837	gm
7c288411-477b-4a69-97af-bb3fd3a45f0d	eeb9ea35-5047-4c3e-ac32-eb3dd8845b07	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:10.84	kg
c43e161f-5327-4b64-b5e0-1028e280765e	eeb9ea35-5047-4c3e-ac32-eb3dd8845b07	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:10.841	gm
98177af7-5034-4147-9c12-aafdda0ac8f2	eeb9ea35-5047-4c3e-ac32-eb3dd8845b07	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:10.843	gm
b4c3a1f1-598e-451b-8b93-1e23bb4a1727	eeb9ea35-5047-4c3e-ac32-eb3dd8845b07	7687b526-7d4f-40e5-b274-c66cca337009	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:10.843	gm
de588d5b-2dea-4a6d-9650-e4f4bf334561	9301e77d-2381-43bd-bd3e-3b829a7182a1	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:10.917	gm
fae46f63-ce87-40a3-a337-6d43ec0cbb8f	9301e77d-2381-43bd-bd3e-3b829a7182a1	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:10.92	gm
8718298c-c6b4-429a-8340-0203d85b4690	61dcea35-c5da-4395-83aa-333ceace0c24	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:10.98	gm
b3d0ceba-a201-4f0f-b28e-3f7964f57c06	61dcea35-c5da-4395-83aa-333ceace0c24	7687b526-7d4f-40e5-b274-c66cca337009	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:10.984	gm
1b303027-51ac-43bd-a708-3e537778e1e1	61dcea35-c5da-4395-83aa-333ceace0c24	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:10.986	pc
5afde231-2c8f-41db-97c4-ec5e3874a4ad	61dcea35-c5da-4395-83aa-333ceace0c24	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:10.987	gm
e3bcb51b-86b1-4ab8-9eb3-85621fece655	61dcea35-c5da-4395-83aa-333ceace0c24	cba9a138-b913-47df-b1fa-61663c7603b0	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:10.988	gm
af3b14c0-adbf-43d5-9f83-0d43047b6f3e	61dcea35-c5da-4395-83aa-333ceace0c24	de8e800e-c915-4d26-9ff5-94701f51222d	1	60.00	0.06	1	60.00	1000	0.06	2025-09-27 15:42:10.989	kg
3a2ef2d5-b729-4339-afee-666ac6af9b1c	61dcea35-c5da-4395-83aa-333ceace0c24	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:10.99	gm
78873eb8-0625-46b2-a705-c8136fc8e00a	61dcea35-c5da-4395-83aa-333ceace0c24	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:10.991	gm
56344cc6-b119-4669-9d0a-7513a687c34f	1ccda3bf-198a-486c-8c82-334d1422db3e	7687b526-7d4f-40e5-b274-c66cca337009	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:11.014	gm
73b6fdfb-51ee-40ed-b8d7-864f3670e8c8	1ccda3bf-198a-486c-8c82-334d1422db3e	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.015	gm
874ceb99-6cb7-49d5-807f-a326b960b1bd	1ccda3bf-198a-486c-8c82-334d1422db3e	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:11.016	kg
335cfe2a-8308-43c0-a3d9-53152bf9b969	1ccda3bf-198a-486c-8c82-334d1422db3e	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	13.00	13.00	250	0.05	1	13.00	2025-09-27 15:42:11.017	pc
188e3ee1-ada9-4fcd-a4ff-a2ac9e118c8d	1ccda3bf-198a-486c-8c82-334d1422db3e	682089ef-89e9-4860-bfe0-e286ada294dd	1	35.00	35.00	1	35.00	1	35.00	2025-09-27 15:42:11.018	pc
5f357f5e-1c1d-41b5-83cc-1063eefd359e	1ccda3bf-198a-486c-8c82-334d1422db3e	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.019	gm
cd302039-0535-4d07-a788-f7e983acc79c	cab4e6b3-6e07-4f2e-a06d-3b904b822f7f	6c1e3d72-7d97-40bb-97b4-93059631140f	1	15.00	15.00	1	15.00	1	15.00	2025-09-27 15:42:11.083	pc
2f6976d1-814e-499c-8c86-276b0540726d	cab4e6b3-6e07-4f2e-a06d-3b904b822f7f	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	13.00	13.00	250	52.00	1000	13.00	2025-09-27 15:42:11.085	gm
b1eb537a-3301-4c8b-b417-1d7212ee6025	cab4e6b3-6e07-4f2e-a06d-3b904b822f7f	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:11.086	gm
15d6c7c4-5929-4883-b9ae-12ca6ced615f	cab4e6b3-6e07-4f2e-a06d-3b904b822f7f	7fded13b-5795-4f23-a8ba-c1c830755b18	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:11.086	gm
efda83e9-4114-4cb5-b9ab-1fb8bccf4d3b	cab4e6b3-6e07-4f2e-a06d-3b904b822f7f	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:11.087	gm
a799dd71-21cc-4729-b873-4a25f6dee1c1	cab4e6b3-6e07-4f2e-a06d-3b904b822f7f	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:11.088	gm
ec53f6c0-6ea5-4ba4-b64b-ef4794ec885a	9f538c46-6c37-43b4-a2a3-108f9e537a35	738a0900-9798-424c-a3f6-04a98bcf3848	2	60.00	0.12	2	60.00	1000	0.12	2025-09-27 15:42:11.175	kg
70ea2c6c-1808-4ca5-8c7b-49c126ecb574	9f538c46-6c37-43b4-a2a3-108f9e537a35	7687b526-7d4f-40e5-b274-c66cca337009	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:11.178	gm
ec36b061-01f5-4167-a21c-9f19c7e5d18f	9f538c46-6c37-43b4-a2a3-108f9e537a35	cba9a138-b913-47df-b1fa-61663c7603b0	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:11.18	gm
a9804f43-0183-48da-951e-98833ce1eb36	4eb96656-fb20-4234-948c-cefd3b6d4e95	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.25	gm
c6c3929f-be62-4e66-abac-0cf793709790	4eb96656-fb20-4234-948c-cefd3b6d4e95	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:11.254	gm
95eb170d-b7dd-4944-9ed1-291c8463ccd1	4eb96656-fb20-4234-948c-cefd3b6d4e95	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:11.255	gm
35f1edd3-2fa1-4543-be8e-f7b21e3b690c	4eb96656-fb20-4234-948c-cefd3b6d4e95	682089ef-89e9-4860-bfe0-e286ada294dd	1	35.00	35.00	1	35.00	1	35.00	2025-09-27 15:42:11.256	pc
e95902a2-a458-4b9c-97e9-c030efe92e3e	4eb96656-fb20-4234-948c-cefd3b6d4e95	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:11.256	kg
4df83bf8-9725-4134-9028-e7905abd9346	4eb96656-fb20-4234-948c-cefd3b6d4e95	7fded13b-5795-4f23-a8ba-c1c830755b18	150	11.00	11.00	150	73.33	1000	11.00	2025-09-27 15:42:11.257	gm
08157545-ec89-48e9-822f-e43f169b51e2	4eb96656-fb20-4234-948c-cefd3b6d4e95	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:11.258	gm
1548fab7-208e-41b0-ad03-2af03d971649	4eb96656-fb20-4234-948c-cefd3b6d4e95	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:11.258	pc
ed58fa6d-fc1c-4672-8a60-cf728f09f1d6	2a18afd3-4d27-441a-a9ec-c66889fd32e9	43f5ae1c-ecad-4e22-9825-712dde5d647e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:11.278	gm
586285ec-4313-4059-9c87-6dcd4a6fa5c5	2a18afd3-4d27-441a-a9ec-c66889fd32e9	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	1	50.00	0.05	1	50.00	1000	0.05	2025-09-27 15:42:11.28	kg
d3851d3a-afc4-4dee-b054-947703bada64	2a18afd3-4d27-441a-a9ec-c66889fd32e9	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:11.281	gm
b66e8e9b-0ce1-4aec-9811-9fb1a4458c43	2a18afd3-4d27-441a-a9ec-c66889fd32e9	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:11.282	kg
bb63b6e3-c577-4ff7-bcb2-b7d772b20f4b	2a18afd3-4d27-441a-a9ec-c66889fd32e9	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:11.283	pc
253e826e-c7da-492f-a4dd-ceb9d9f97ee7	2a18afd3-4d27-441a-a9ec-c66889fd32e9	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:11.284	gm
395b5cbb-d956-4c48-ba24-e882a9b327d3	2a18afd3-4d27-441a-a9ec-c66889fd32e9	682089ef-89e9-4860-bfe0-e286ada294dd	1	35.00	35.00	1	35.00	1	35.00	2025-09-27 15:42:11.285	pc
50adb426-466e-4e65-ac35-5d3befb4c776	2a18afd3-4d27-441a-a9ec-c66889fd32e9	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.286	gm
2a7f6eaf-f779-4d6c-948f-bf6033dc11dc	2a18afd3-4d27-441a-a9ec-c66889fd32e9	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:11.286	gm
4ebe67da-d72b-428c-8e8f-47c2954dffa3	2a18afd3-4d27-441a-a9ec-c66889fd32e9	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	200	30.00	30.00	200	150.00	1000	30.00	2025-09-27 15:42:11.287	gm
3466ee27-2abc-4912-80ee-2ac91f9adfc1	0737e956-6491-4809-b91c-ca076f81502c	c623d1cc-09b3-48ae-96c1-e996053ab84a	250	23.00	23.00	250	92.00	1000	23.00	2025-09-27 15:42:11.305	gm
54ac54e5-d0e7-43cf-8750-eff1f094dc00	0737e956-6491-4809-b91c-ca076f81502c	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:11.306	gm
da21ed51-1a00-4379-b36f-9d1fa9eab53e	0737e956-6491-4809-b91c-ca076f81502c	7687b526-7d4f-40e5-b274-c66cca337009	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:11.307	gm
13332a58-c655-4ace-9db8-768a5b46050a	0737e956-6491-4809-b91c-ca076f81502c	cba9a138-b913-47df-b1fa-61663c7603b0	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:11.308	gm
59d3646f-f800-4700-b146-d2823a7ef10a	0737e956-6491-4809-b91c-ca076f81502c	682089ef-89e9-4860-bfe0-e286ada294dd	1	35.00	35.00	1	35.00	1	35.00	2025-09-27 15:42:11.309	pc
0ab7388b-7eac-462e-9197-cb127a76b908	0737e956-6491-4809-b91c-ca076f81502c	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:11.31	gm
ccd27321-cb8c-4f0f-a1f1-9517810c360f	0737e956-6491-4809-b91c-ca076f81502c	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.31	gm
dae95cfc-027d-42b5-b86f-8ba55a5124b7	0737e956-6491-4809-b91c-ca076f81502c	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	200	30.00	30.00	200	150.00	1000	30.00	2025-09-27 15:42:11.311	gm
f3bfec51-acec-435c-889e-d70fe3057b99	0737e956-6491-4809-b91c-ca076f81502c	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:11.311	gm
02886c22-aa93-4086-bc98-be9b9d0407a8	125482b8-aed9-4297-9624-dbad6cdc09b7	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:11.329	gm
03711508-3235-4cd5-b110-700de47c3f91	125482b8-aed9-4297-9624-dbad6cdc09b7	7fded13b-5795-4f23-a8ba-c1c830755b18	100	7.00	7.00	100	70.00	1000	7.00	2025-09-27 15:42:11.33	gm
8ed60b3e-c77c-43c2-8b38-96d2ef34ad03	efad2c03-3926-437b-bf3c-46d61353d458	c623d1cc-09b3-48ae-96c1-e996053ab84a	100	20.00	20.00	100	20.00	100	20.00	2025-10-07 14:47:21.445944	gm
64dcf3ad-deb9-4bd1-a25e-a5b8a4799f5d	125482b8-aed9-4297-9624-dbad6cdc09b7	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:11.331	gm
dcc1aad8-72a8-427d-901a-f0cf093d0de3	125482b8-aed9-4297-9624-dbad6cdc09b7	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:11.331	gm
39bb1e59-51d6-4333-9c4a-5c8506f692b4	125482b8-aed9-4297-9624-dbad6cdc09b7	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:11.332	gm
12223918-27b2-4e58-830f-135520dff7f1	b2f5b35e-495d-41f4-97de-aa460b42b3a5	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:11.356	gm
43c099ad-3570-4a27-b3c4-6ba36b587169	b2f5b35e-495d-41f4-97de-aa460b42b3a5	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:11.358	gm
92f48045-e95d-4aa4-be55-290617d4626e	b2f5b35e-495d-41f4-97de-aa460b42b3a5	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.359	gm
3a2617a2-dc1c-425c-a0fb-84a1f8a10c88	b2f5b35e-495d-41f4-97de-aa460b42b3a5	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:11.36	pc
c05c5412-87b7-4b5f-b51e-1bfaef40b5fb	b2f5b35e-495d-41f4-97de-aa460b42b3a5	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:11.361	gm
bf377e83-0425-4955-83b7-3e91b48f4954	6f75e436-f15f-4115-808e-cc74946cfb71	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.397	gm
4b95b28d-3ab2-4565-8f73-682961607d36	6f75e436-f15f-4115-808e-cc74946cfb71	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	13.00	13.00	250	52.00	1000	13.00	2025-09-27 15:42:11.4	gm
75c38bf4-1648-4c11-9d99-43398d8f7f79	efc47bb6-cc7b-4959-bcbb-16e2a5a80b0b	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.422	gm
ce9dc65b-301e-4146-bc3e-13d463c25aec	efc47bb6-cc7b-4959-bcbb-16e2a5a80b0b	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:11.425	gm
6a8e18f0-a2db-47cd-8ecc-527fefbe8891	efc47bb6-cc7b-4959-bcbb-16e2a5a80b0b	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:11.426	gm
9117b68d-22e0-46fd-aa04-c6d0ca08172d	f134b614-304d-439b-b6fa-0add71c1a1b1	0653ab92-5171-418b-89d2-9e6b60482bbb	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:11.445	gm
ff255cd1-d3b3-4f09-98c4-e9c6fbb85036	f134b614-304d-439b-b6fa-0add71c1a1b1	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:11.447	gm
aa969fea-55b3-445e-95b4-33ce01ef3a28	45649b05-3995-4bb2-bdd0-8772918ada83	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:11.469	gm
bde1fc09-7430-4fe7-afaf-bd9d096c9744	45649b05-3995-4bb2-bdd0-8772918ada83	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:11.47	gm
c8cd9c0a-129a-4a3f-a2f9-b8c2e421daf1	45649b05-3995-4bb2-bdd0-8772918ada83	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.472	gm
4e17794e-637c-40fc-953a-31eda2c83b1e	45649b05-3995-4bb2-bdd0-8772918ada83	7fded13b-5795-4f23-a8ba-c1c830755b18	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:11.474	gm
ec5bac9f-b431-4604-bd0b-3a0264b71a8a	45649b05-3995-4bb2-bdd0-8772918ada83	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:11.475	gm
7ad8cf12-ef17-4deb-aec5-687fa4ec6e6d	45649b05-3995-4bb2-bdd0-8772918ada83	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.475	gm
e9bf930f-3b91-485c-8cdf-d9b03d542c8c	a7c15b13-9641-4c9c-b943-c98524ec2d78	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.497	gm
1a0c6a53-e1b4-46ac-8470-8ed78a8bf2f3	a7c15b13-9641-4c9c-b943-c98524ec2d78	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:11.499	gm
39f89147-120e-4bba-af12-9a2e0555bcf4	a7c15b13-9641-4c9c-b943-c98524ec2d78	7fded13b-5795-4f23-a8ba-c1c830755b18	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:11.501	gm
0a7ac8e9-8ffe-41fe-9363-938c969c14f1	61329510-23b0-4736-b939-840d793f4da9	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:11.525	gm
d5ec6941-e77e-4a49-983f-13d0488d2445	61329510-23b0-4736-b939-840d793f4da9	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.528	gm
1ff3b843-2e32-476b-a615-a9a1743dd9c3	61329510-23b0-4736-b939-840d793f4da9	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:11.529	gm
915b5591-7679-4896-899c-226c3b1f9a3b	61329510-23b0-4736-b939-840d793f4da9	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.53	gm
61704d77-0228-4591-ba30-e69e53c00dc4	61329510-23b0-4736-b939-840d793f4da9	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:11.531	gm
973df4dd-0a76-43b8-b512-24f356585d6a	61329510-23b0-4736-b939-840d793f4da9	de8e800e-c915-4d26-9ff5-94701f51222d	1	60.00	0.06	1	60.00	1000	0.06	2025-09-27 15:42:11.532	kg
ccc3f893-f607-43c9-904d-ae01de7fb881	61329510-23b0-4736-b939-840d793f4da9	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.532	gm
bcd2addf-cac9-4d29-a645-3a89c352ba00	61329510-23b0-4736-b939-840d793f4da9	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:11.533	kg
0af3d27c-c861-41d7-ba8a-c918eb7d90db	c0606c43-6303-4fac-94ba-b99f0715a074	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.554	gm
4890786a-d563-400e-a320-82e0f2f3f507	c0606c43-6303-4fac-94ba-b99f0715a074	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.556	gm
1f34600b-bffd-43b2-aebd-223011c9ca41	c0f61f72-2674-4dcb-8969-663a0bc2e092	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	500	60.00	60.00	500	120.00	1000	60.00	2025-09-27 15:42:11.577	gm
76b196c2-d6bb-4027-a656-c09da86bb798	40b468fe-59b6-4fb8-8ae5-6a88c978d313	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:11.598	gm
2cbcceca-a97c-41f6-83e1-adde182394ac	40b468fe-59b6-4fb8-8ae5-6a88c978d313	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:11.6	gm
59155b61-bac9-4924-866b-5433ab342f6b	40b468fe-59b6-4fb8-8ae5-6a88c978d313	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:11.602	gm
35bb2480-2d21-4560-9a74-6589f5c2c8e4	40b468fe-59b6-4fb8-8ae5-6a88c978d313	bd71ec96-c096-496b-9993-b560661cbb48	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:11.602	gm
f1fe0e8b-a542-4f70-8d04-6b7f1648affa	40b468fe-59b6-4fb8-8ae5-6a88c978d313	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:11.603	gm
04869e1e-463f-46b3-bc3f-69386a27d686	40b468fe-59b6-4fb8-8ae5-6a88c978d313	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:11.604	gm
1f01994a-8a0c-4403-9122-141ed33c7f4c	40b468fe-59b6-4fb8-8ae5-6a88c978d313	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	65.00	65.00	500	130.00	1000	65.00	2025-09-27 15:42:11.605	gm
79d014cc-2da8-4d5c-9a14-3aeea975d9cf	40b468fe-59b6-4fb8-8ae5-6a88c978d313	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	5000	0.00	0.00	5000	0.00	1000	0.00	2025-09-27 15:42:11.606	gm
bfec9185-0c70-42e4-9796-50c31ac2b1c6	40b468fe-59b6-4fb8-8ae5-6a88c978d313	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:11.607	gm
38a4fea7-eafb-471f-8f8e-421d1349e628	ac5b044c-157d-4445-bd11-b657e9bdc7ec	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:11.627	gm
ad903c58-7c6d-4df2-b117-01dd7073088a	ac5b044c-157d-4445-bd11-b657e9bdc7ec	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:11.629	gm
1e493027-2df1-40df-94ac-437f9231cd35	ac5b044c-157d-4445-bd11-b657e9bdc7ec	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:11.63	gm
1be73bc6-80e6-487a-a057-8e827e1bfbd9	ac5b044c-157d-4445-bd11-b657e9bdc7ec	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.631	gm
9df26f25-5387-4485-915a-7c605a651932	ac5b044c-157d-4445-bd11-b657e9bdc7ec	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:11.631	gm
c79a281f-c882-4693-bc34-70f797d89494	ac5b044c-157d-4445-bd11-b657e9bdc7ec	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:11.632	gm
4e00e13c-a3c0-4957-9506-f966d21b8061	ac5b044c-157d-4445-bd11-b657e9bdc7ec	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	250	13.00	13.00	250	52.00	1000	13.00	2025-09-27 15:42:11.632	gm
227c25be-cd4d-427a-b518-ae7fdfd30baa	ac5b044c-157d-4445-bd11-b657e9bdc7ec	cba9a138-b913-47df-b1fa-61663c7603b0	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:11.633	gm
658643a4-abde-4689-bb41-9790322c84ca	ac5b044c-157d-4445-bd11-b657e9bdc7ec	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:11.633	gm
dfccee84-4f22-4c7d-890d-df130889475e	ac5b044c-157d-4445-bd11-b657e9bdc7ec	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:11.634	gm
8a35f5a6-8955-428d-9b7e-79922aa88e32	ac5b044c-157d-4445-bd11-b657e9bdc7ec	bd71ec96-c096-496b-9993-b560661cbb48	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:11.634	gm
2c861024-2890-4fc5-8bef-6ff92c0198c9	636a8c7a-ce84-44de-bb8d-c57a0d409d21	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:11.655	gm
ca186c9d-15bf-4ecc-b33e-866ff8bacdcb	636a8c7a-ce84-44de-bb8d-c57a0d409d21	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:11.656	gm
ba6eafdd-c546-4a04-8691-46bf42b91ef2	fa016562-70f4-485d-b87a-9521e754b04d	c623d1cc-09b3-48ae-96c1-e996053ab84a	100	20.00	20.00	100	20.00	100	20.00	2025-10-02 14:23:24.423958	gm
852ba9ff-378a-4a38-a5a5-fed1b3738cda	636a8c7a-ce84-44de-bb8d-c57a0d409d21	682089ef-89e9-4860-bfe0-e286ada294dd	1	35.00	35.00	1	35.00	1	35.00	2025-09-27 15:42:11.656	pc
3a7f77bf-5516-494a-844c-3333d5564801	636a8c7a-ce84-44de-bb8d-c57a0d409d21	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:11.657	gm
da0723de-2a3a-4f6f-83f4-5db55fe16f06	636a8c7a-ce84-44de-bb8d-c57a0d409d21	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.657	gm
62286257-8326-49f7-88f9-b63395ae3442	636a8c7a-ce84-44de-bb8d-c57a0d409d21	6c1e3d72-7d97-40bb-97b4-93059631140f	1	15.00	15.00	1	15.00	1	15.00	2025-09-27 15:42:11.658	pc
e39166a4-4d21-46f2-a816-abf044204342	636a8c7a-ce84-44de-bb8d-c57a0d409d21	738a0900-9798-424c-a3f6-04a98bcf3848	2	60.00	0.12	2	60.00	1000	0.12	2025-09-27 15:42:11.658	kg
8755dc6d-9cbc-4571-ae96-309b6ece92ea	636a8c7a-ce84-44de-bb8d-c57a0d409d21	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-09-27 15:42:11.658	pc
44cbccba-1a9f-4eea-b2d1-e12403bb2000	636a8c7a-ce84-44de-bb8d-c57a0d409d21	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:11.659	gm
22107bb9-eece-4b69-9798-c4628e2942f7	636a8c7a-ce84-44de-bb8d-c57a0d409d21	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.659	gm
6dff0913-fdc7-4366-9bad-99f529836624	636a8c7a-ce84-44de-bb8d-c57a0d409d21	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:11.66	gm
0ff5cb9d-6805-4f4b-be49-b1fc26baaf61	42da418f-d58b-4c8e-8424-dbf3d067cd9c	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.68	gm
1c783754-4736-4a54-9ea0-a5efd0034c9f	42da418f-d58b-4c8e-8424-dbf3d067cd9c	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:11.681	kg
4f7db9cb-065f-42fd-8da0-a4fe2a664fac	42da418f-d58b-4c8e-8424-dbf3d067cd9c	0653ab92-5171-418b-89d2-9e6b60482bbb	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:11.682	gm
4956b8d4-3310-4373-a0d6-d9c983066761	42da418f-d58b-4c8e-8424-dbf3d067cd9c	682089ef-89e9-4860-bfe0-e286ada294dd	1	35.00	35.00	1	35.00	1	35.00	2025-09-27 15:42:11.682	pc
9b855f3b-43ce-49e8-81b5-b4553d3b0cd2	42da418f-d58b-4c8e-8424-dbf3d067cd9c	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:11.683	gm
286bd488-fabe-456a-9298-54824b2f0457	42da418f-d58b-4c8e-8424-dbf3d067cd9c	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:11.683	gm
bc0f247d-e6d3-4286-9bd0-fb6f6d74f203	42da418f-d58b-4c8e-8424-dbf3d067cd9c	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.683	gm
959dae2a-01de-40c6-8e6a-99be10250309	42da418f-d58b-4c8e-8424-dbf3d067cd9c	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:11.684	gm
8adc3b55-3336-409c-a9ac-75c211299b85	42da418f-d58b-4c8e-8424-dbf3d067cd9c	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	200	30.00	30.00	200	150.00	1000	30.00	2025-09-27 15:42:11.684	gm
ff07c13e-0b98-4ebe-8798-b0e6c55262ca	42da418f-d58b-4c8e-8424-dbf3d067cd9c	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:11.684	gm
909418de-9b7e-4547-99d6-e2766a2066c1	12f61f2a-49ba-41e2-810b-4dfd15c49201	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.706	gm
5032c827-87c3-4734-af0a-3e71aadf1a9e	12f61f2a-49ba-41e2-810b-4dfd15c49201	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:11.707	gm
38215a4b-b837-471a-84d8-162681a01893	12f61f2a-49ba-41e2-810b-4dfd15c49201	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	200	30.00	30.00	200	150.00	1000	30.00	2025-09-27 15:42:11.707	gm
e9739cd7-5ee2-47fd-8823-78d11b8a32ca	12f61f2a-49ba-41e2-810b-4dfd15c49201	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.708	gm
dc900abf-2188-4c54-be02-5c8a791482c8	12f61f2a-49ba-41e2-810b-4dfd15c49201	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:11.708	gm
0c5973fa-2d26-4de2-92a6-a5a3cf30b437	12f61f2a-49ba-41e2-810b-4dfd15c49201	2eae0636-1fa4-4d47-855f-306125787b1e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:11.708	gm
7606bd46-c578-4809-8846-cd663ee79c98	12f61f2a-49ba-41e2-810b-4dfd15c49201	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:11.709	pc
f5558698-0ee9-4dd1-a4cb-ab6598993e83	12f61f2a-49ba-41e2-810b-4dfd15c49201	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	65.00	65.00	500	130.00	1000	65.00	2025-09-27 15:42:11.709	gm
7533b2f5-d051-42f9-b4cd-c6c851d1919c	45254c6c-67ab-426c-9e6c-266a55b2be1b	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:11.736	gm
24c32090-f79d-4ddb-92bd-c1cbb7763e09	45254c6c-67ab-426c-9e6c-266a55b2be1b	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.737	gm
36f55f66-afed-4de9-8d20-1c01f9a0b148	45254c6c-67ab-426c-9e6c-266a55b2be1b	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:11.738	gm
70957f46-d6af-4637-9c03-40d8636bdb7b	45254c6c-67ab-426c-9e6c-266a55b2be1b	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:11.738	gm
57ba5625-4675-4685-b0e6-7fc3d4e57911	45254c6c-67ab-426c-9e6c-266a55b2be1b	682089ef-89e9-4860-bfe0-e286ada294dd	1	35.00	35.00	1	35.00	1	35.00	2025-09-27 15:42:11.739	pc
11f03477-c86f-4c5d-ab4d-844b0f16bd09	45254c6c-67ab-426c-9e6c-266a55b2be1b	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:11.739	gm
78f0c4bf-13d9-4a8b-9a1a-25133e666ed3	45254c6c-67ab-426c-9e6c-266a55b2be1b	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:11.74	gm
f4a6c6cb-419f-4cfb-9bd8-6678ec670d4b	45254c6c-67ab-426c-9e6c-266a55b2be1b	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:11.74	gm
894b12b8-e230-4574-9ca4-504898e0134f	45254c6c-67ab-426c-9e6c-266a55b2be1b	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	200	30.00	30.00	200	150.00	1000	30.00	2025-09-27 15:42:11.741	gm
6128c660-c3e3-4433-89d5-b3c0b32ce0f6	45254c6c-67ab-426c-9e6c-266a55b2be1b	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-09-27 15:42:11.741	pc
f8634d3b-34e8-4877-a4a8-f80a88c0509d	45254c6c-67ab-426c-9e6c-266a55b2be1b	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:11.741	gm
34d3efa5-d310-44ce-8ceb-a4e517f82a6d	45254c6c-67ab-426c-9e6c-266a55b2be1b	cba9a138-b913-47df-b1fa-61663c7603b0	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:11.742	kg
1bbb835d-e4ab-46da-b8cd-3cdc9b611bdd	45254c6c-67ab-426c-9e6c-266a55b2be1b	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:11.742	gm
bb3247c4-9118-420f-b3b5-a3cb46325eb0	45254c6c-67ab-426c-9e6c-266a55b2be1b	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:11.743	gm
22d3723c-1dee-4b65-83d0-1174bef65e8d	45254c6c-67ab-426c-9e6c-266a55b2be1b	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:11.743	kg
08fb6910-987f-4cf5-8b09-b303667fa6a2	45254c6c-67ab-426c-9e6c-266a55b2be1b	bd71ec96-c096-496b-9993-b560661cbb48	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:11.744	gm
c33d5857-c666-4016-b664-a9e8d569faa2	45254c6c-67ab-426c-9e6c-266a55b2be1b	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.744	gm
3f4efe9d-4ba2-4a40-93ea-30a70ae71b81	45254c6c-67ab-426c-9e6c-266a55b2be1b	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:11.745	gm
2aaa64df-74f7-40e3-85c9-4ecb893adcc0	45254c6c-67ab-426c-9e6c-266a55b2be1b	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:11.745	pc
d88273cd-b89c-414a-89e1-79c047dcb418	ba41f061-cdc1-4cda-95ba-e2caad43b20a	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.767	gm
b1965cd6-aa64-4046-8cab-47c8f88bfded	ba41f061-cdc1-4cda-95ba-e2caad43b20a	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:11.768	gm
64f7a9d0-a32a-4ff9-bafc-51271953a137	ba41f061-cdc1-4cda-95ba-e2caad43b20a	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:11.768	gm
95921532-a90d-49a2-92b8-2bb7cedd184d	ba41f061-cdc1-4cda-95ba-e2caad43b20a	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.768	gm
ba920b5b-9a42-4e7e-97b4-0922021f90b6	ba41f061-cdc1-4cda-95ba-e2caad43b20a	682089ef-89e9-4860-bfe0-e286ada294dd	1	35.00	35.00	1	35.00	1	35.00	2025-09-27 15:42:11.769	pc
d2deadc2-67da-4426-8286-cff2d81b534d	ba41f061-cdc1-4cda-95ba-e2caad43b20a	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	13.00	13.00	250	52.00	1000	13.00	2025-09-27 15:42:11.769	gm
c350a604-1f1f-4f81-adfe-ed93f87d83cc	ba41f061-cdc1-4cda-95ba-e2caad43b20a	feb933e8-b9cb-4046-978c-f8619c693eb5	500	60.00	60.00	500	120.00	1000	60.00	2025-09-27 15:42:11.77	gm
707b4824-c5e0-4712-a7bf-7abf26eabad1	9e186e3c-b864-4ccb-a39c-6965005de7a2	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.792	gm
fd399433-aa3f-4373-a1b5-e793e2635fab	9e186e3c-b864-4ccb-a39c-6965005de7a2	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:11.793	gm
7eb4f425-9d05-47d7-9570-9979be44562e	9e186e3c-b864-4ccb-a39c-6965005de7a2	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:11.793	gm
8230c517-919b-4c46-a838-c8eca36b8b5f	9e186e3c-b864-4ccb-a39c-6965005de7a2	97d66b60-b3da-41f0-a6b0-305cbb2fb464	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:11.794	gm
a87e5faf-1457-4f60-bf4c-cb69999730c6	fa016562-70f4-485d-b87a-9521e754b04d	682089ef-89e9-4860-bfe0-e286ada294dd	2	20.00	40.00	2	20.00	1	40.00	2025-10-02 14:23:24.423958	pc
e4ad4de9-8e6e-479b-b33d-2892e2deb170	9e186e3c-b864-4ccb-a39c-6965005de7a2	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:11.794	gm
99673b0a-9e9c-46b1-b6b1-c5751b0be398	9e186e3c-b864-4ccb-a39c-6965005de7a2	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:11.795	gm
94fa15a6-cfef-4ff6-adb1-5ca84ad0fe28	9e186e3c-b864-4ccb-a39c-6965005de7a2	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:11.795	gm
46938ae3-1bde-4944-be3b-215568d9be5b	9e186e3c-b864-4ccb-a39c-6965005de7a2	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:11.796	gm
1a13e349-34ae-4f7f-91e5-f72b725315f1	23ba7684-c8e8-4a5d-bc6c-49375fdd60f6	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.814	gm
eb111bd6-0a10-42d8-9de9-640a9cc08759	23ba7684-c8e8-4a5d-bc6c-49375fdd60f6	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:11.815	gm
2084dfea-c7dd-4bc5-8bf8-7dceedd546c8	23ba7684-c8e8-4a5d-bc6c-49375fdd60f6	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	1	50.00	0.05	1	50.00	1000	0.05	2025-09-27 15:42:11.815	kg
28fbcd34-40b2-4208-aeb3-958bee1c8f24	23ba7684-c8e8-4a5d-bc6c-49375fdd60f6	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:11.816	gm
7967b66f-60ab-4b56-9c0f-17737e5aa515	bf8d3fe5-11c1-45c2-a7eb-c4f73ebb325d	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.853	gm
dae58e14-681d-4fd8-97a7-7ac2c8c4c7d6	bf8d3fe5-11c1-45c2-a7eb-c4f73ebb325d	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:11.854	gm
7586d2c7-c363-4294-bb4f-520316e0e82e	bf8d3fe5-11c1-45c2-a7eb-c4f73ebb325d	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:11.855	gm
168d7341-c524-4045-bfb8-627b6858ce9f	bf8d3fe5-11c1-45c2-a7eb-c4f73ebb325d	35660cc6-d186-4b87-9c97-3c07bbc5303f	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:11.855	gm
988c406c-24a5-4e60-bd74-af91437c98d8	1b9fe316-7b04-40c5-b7f6-b953ca8b4d94	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.877	gm
c7edbe12-ee7d-4be3-80b1-0bded54a4eed	1b9fe316-7b04-40c5-b7f6-b953ca8b4d94	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:11.878	gm
5fd3f7e2-fe34-45b6-93e2-193c1a0aacef	1b9fe316-7b04-40c5-b7f6-b953ca8b4d94	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:11.879	gm
8c4c4ea1-29f0-4f31-8100-802fe56d8244	1b9fe316-7b04-40c5-b7f6-b953ca8b4d94	0653ab92-5171-418b-89d2-9e6b60482bbb	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:11.879	gm
94e526e2-504c-4725-a18b-dbbff08b2d12	1b9fe316-7b04-40c5-b7f6-b953ca8b4d94	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:11.88	gm
38b38598-434a-483f-acda-b69ff97a5a8f	f59dcdba-0e38-49ee-bb73-9c7102b6629d	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	500	60.00	60.00	500	120.00	1000	60.00	2025-09-27 15:42:11.902	gm
5e274c9f-6c2a-4a26-9650-e311ba7fba0e	f59dcdba-0e38-49ee-bb73-9c7102b6629d	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:11.903	gm
124de4cd-5e1e-406c-9686-f519bfb6bd20	f59dcdba-0e38-49ee-bb73-9c7102b6629d	de8e800e-c915-4d26-9ff5-94701f51222d	1	60.00	0.06	1	60.00	1000	0.06	2025-09-27 15:42:11.904	kg
f3166fa1-2a41-4bf6-9f2c-3ed5bb767f0c	f59dcdba-0e38-49ee-bb73-9c7102b6629d	bd71ec96-c096-496b-9993-b560661cbb48	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:11.904	gm
fc9faa37-bb53-4b4a-8a17-224bc3c79d26	f59dcdba-0e38-49ee-bb73-9c7102b6629d	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:11.905	gm
247a3793-b349-45d2-a744-03fcc67c6b99	f59dcdba-0e38-49ee-bb73-9c7102b6629d	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:11.906	gm
9627fa93-78b5-4863-94b3-449c57ead077	f59dcdba-0e38-49ee-bb73-9c7102b6629d	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:11.906	gm
ead46058-e700-4b86-b476-914f58f21125	f59dcdba-0e38-49ee-bb73-9c7102b6629d	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:11.907	gm
cd09d1f5-9749-4830-8df1-97005d8ea9c8	f59dcdba-0e38-49ee-bb73-9c7102b6629d	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	13.00	13.00	250	52.00	1000	13.00	2025-09-27 15:42:11.907	gm
7f02ef5c-5e65-4603-b575-ab71bcfbf0aa	f59dcdba-0e38-49ee-bb73-9c7102b6629d	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:11.907	gm
b7cac83f-32e7-442c-953f-44741c0666c4	f59dcdba-0e38-49ee-bb73-9c7102b6629d	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.908	gm
facd3789-c42d-4881-aaee-3eeed09028e5	f59dcdba-0e38-49ee-bb73-9c7102b6629d	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:11.908	pc
49a9706e-c19b-4cf4-97da-cedca756289b	f59dcdba-0e38-49ee-bb73-9c7102b6629d	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:11.909	kg
f63c0aca-3e2d-4b22-8712-5327e0d7e5fe	7d8828ea-a963-4e79-b99a-c7f729bbfd7e	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:11.977	kg
2558a985-bfb7-4df0-89f2-02f3793216f8	7d8828ea-a963-4e79-b99a-c7f729bbfd7e	97d66b60-b3da-41f0-a6b0-305cbb2fb464	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:11.979	gm
7d729436-4721-4166-8e64-20f81275e799	7d8828ea-a963-4e79-b99a-c7f729bbfd7e	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:11.98	gm
e74498ef-bc4e-4881-b8b5-0774beeb10d9	7d8828ea-a963-4e79-b99a-c7f729bbfd7e	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:11.98	gm
6cbbe8b4-8427-4385-bfce-9769a5cf40d5	7d8828ea-a963-4e79-b99a-c7f729bbfd7e	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:11.981	gm
39707ef2-2521-4bff-a1e9-f9bd0897f5e7	7d8828ea-a963-4e79-b99a-c7f729bbfd7e	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:11.982	gm
382cdbbc-8f9f-461d-993a-bdcb64de36e5	7d8828ea-a963-4e79-b99a-c7f729bbfd7e	feb933e8-b9cb-4046-978c-f8619c693eb5	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:11.982	gm
6e53902b-a97f-420e-85df-302733c5310e	b34037ba-ffd9-413d-85da-a7875ce4220e	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.01	gm
a8e13e87-d1bd-476d-a0a1-205654cf0aa4	b34037ba-ffd9-413d-85da-a7875ce4220e	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:12.012	gm
90a334e8-e1f1-40f8-bbce-88faaa55c6d1	b34037ba-ffd9-413d-85da-a7875ce4220e	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:12.013	gm
71a203fb-9023-4ce4-a00a-b83ce83b1006	b34037ba-ffd9-413d-85da-a7875ce4220e	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:12.014	gm
612c49c6-f91a-4c30-ab93-f6acdc80adcd	b34037ba-ffd9-413d-85da-a7875ce4220e	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	250	13.00	13.00	250	52.00	1000	13.00	2025-09-27 15:42:12.014	gm
1dc19fc8-f116-4606-9721-51f6718d6d41	91422255-07e3-47ac-a40f-ff8d1b8300a3	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.057	gm
0239bd41-2bd6-4604-b1f9-11b28d4a7636	91422255-07e3-47ac-a40f-ff8d1b8300a3	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:12.059	kg
a4162a40-207b-44a9-8570-3f1a2cf8a0b7	91422255-07e3-47ac-a40f-ff8d1b8300a3	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:12.06	gm
edc1a246-79b0-4a79-9d9a-a3536c0a15d1	ed409bf6-456c-4f8b-b4b5-0593488334ed	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.081	gm
4a03c2ed-093b-4acf-8fba-3b0e74f52e2e	ed409bf6-456c-4f8b-b4b5-0593488334ed	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:12.084	kg
9b785e33-0e2c-4a5b-ba4a-4b4ca935a7ce	ed409bf6-456c-4f8b-b4b5-0593488334ed	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:12.084	gm
20e8ed72-d1dc-4ff0-ba46-eaa5c563478f	277efe81-2ceb-406d-942a-b7b799c0e133	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.106	gm
3888c034-6407-4c38-970e-50e997f9fc6f	277efe81-2ceb-406d-942a-b7b799c0e133	feb933e8-b9cb-4046-978c-f8619c693eb5	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:12.108	gm
806abdd9-614f-4515-83e2-f29381c5e0f8	277efe81-2ceb-406d-942a-b7b799c0e133	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:12.109	pc
eb2c5879-13a7-4c31-92f9-80544b00b821	277efe81-2ceb-406d-942a-b7b799c0e133	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:12.11	gm
2dab39f9-0775-432b-a155-3c051131d327	277efe81-2ceb-406d-942a-b7b799c0e133	bd71ec96-c096-496b-9993-b560661cbb48	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:12.111	gm
096945c2-8f5b-4955-b6f7-5ba20e175d6e	277efe81-2ceb-406d-942a-b7b799c0e133	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:12.112	kg
8787f9e4-b88b-4615-a2da-02a49281a4ac	277efe81-2ceb-406d-942a-b7b799c0e133	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:12.113	gm
73b2dca9-74e2-4b72-9d3b-83baa5788768	277efe81-2ceb-406d-942a-b7b799c0e133	682089ef-89e9-4860-bfe0-e286ada294dd	1	35.00	35.00	1	35.00	1	35.00	2025-09-27 15:42:12.113	pc
a340f685-9e97-4f15-b5cc-fce4084bcbe6	277efe81-2ceb-406d-942a-b7b799c0e133	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:12.114	gm
e0fe1dc0-930a-4c18-9540-c194c1daf135	fa016562-70f4-485d-b87a-9521e754b04d	cba9a138-b913-47df-b1fa-61663c7603b0	2	30.00	120.00	2	30.00	500	120.00	2025-10-02 14:23:24.423958	kg
aaa942ce-672c-4d89-8b50-ed31b3f8cbc2	ee16d2fd-a359-47ff-bade-c91f4e181e84	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.14	gm
abaf4f12-ee53-46ca-a3e1-7f6496b38afd	ee16d2fd-a359-47ff-bade-c91f4e181e84	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	13.00	13.00	250	52.00	1000	13.00	2025-09-27 15:42:12.143	gm
9583d4bd-e230-44b0-b5d8-d461486ba045	ee16d2fd-a359-47ff-bade-c91f4e181e84	6c1e3d72-7d97-40bb-97b4-93059631140f	1	15.00	15.00	1	15.00	1	15.00	2025-09-27 15:42:12.144	pc
b421cac2-bff8-4806-aa33-f87d7e607e58	ee16d2fd-a359-47ff-bade-c91f4e181e84	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:12.145	gm
89dd2229-97d7-4f0a-a3e3-48da7107a3ef	ee16d2fd-a359-47ff-bade-c91f4e181e84	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:12.146	gm
983bd859-c8b0-4b56-a861-461be2f09b6f	ee16d2fd-a359-47ff-bade-c91f4e181e84	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:12.146	kg
11a2b4f9-a631-436e-81ea-8c69f328bb58	ee16d2fd-a359-47ff-bade-c91f4e181e84	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:12.147	gm
00ec567b-0201-4a0e-b4eb-539803f9efbe	c8a8637b-5138-4dd2-9f56-8d24862caef2	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.169	gm
ece08927-3bd8-42a9-a348-76950089645a	c8a8637b-5138-4dd2-9f56-8d24862caef2	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:12.172	gm
694c8930-d594-40e7-9a04-8c03c0e9e875	c8a8637b-5138-4dd2-9f56-8d24862caef2	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:12.173	gm
542f8e1e-c886-42cc-a3d2-2d7a644f55ec	c8a8637b-5138-4dd2-9f56-8d24862caef2	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:12.174	gm
73dc9ce4-20d7-4ba6-8942-8020125a9680	c8a8637b-5138-4dd2-9f56-8d24862caef2	cba9a138-b913-47df-b1fa-61663c7603b0	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:12.175	kg
fb9161dd-b5de-4ba8-b82a-03889266a767	c8a8637b-5138-4dd2-9f56-8d24862caef2	feb933e8-b9cb-4046-978c-f8619c693eb5	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:12.176	gm
b9b2a90b-beb0-4896-9ed1-10c198099e46	c8a8637b-5138-4dd2-9f56-8d24862caef2	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.177	gm
54e70d56-8bd0-4c5a-b886-07f4578876e5	c8a8637b-5138-4dd2-9f56-8d24862caef2	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:12.179	gm
06cdd657-52de-4056-9f86-e99036a1094e	fe3ba24e-4ef8-4169-bc9f-5e550c268d22	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.197	gm
09380ae4-8200-4d81-8833-1e615a99237f	fe3ba24e-4ef8-4169-bc9f-5e550c268d22	cba9a138-b913-47df-b1fa-61663c7603b0	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:12.199	kg
221d8a90-c4c0-44eb-a4d2-07cab9858ac1	fe3ba24e-4ef8-4169-bc9f-5e550c268d22	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	65.00	65.00	500	130.00	1000	65.00	2025-09-27 15:42:12.2	gm
ca85bd1e-d430-469a-85fc-f42d897566e7	fe3ba24e-4ef8-4169-bc9f-5e550c268d22	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	65.00	65.00	500	130.00	1000	65.00	2025-09-27 15:42:12.201	gm
4e7e53b5-a759-46b3-94d6-fd83b899379d	65ed19ce-e862-4bee-8cea-fa0163df452f	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.222	gm
8e207c0b-cb3e-43b1-9734-74761083a9b7	65ed19ce-e862-4bee-8cea-fa0163df452f	682089ef-89e9-4860-bfe0-e286ada294dd	1	35.00	35.00	1	35.00	1	35.00	2025-09-27 15:42:12.224	pc
d61fae74-ee42-4d88-85f2-003816e227fd	65ed19ce-e862-4bee-8cea-fa0163df452f	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	65.00	65.00	500	130.00	1000	65.00	2025-09-27 15:42:12.226	gm
85f494c1-6428-41d3-8670-ae30e860467b	91ca2bc2-cd5b-4f9c-aa1e-90e1916e0154	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.247	gm
39f4ed18-451e-4320-9be2-92c2c9721f14	91ca2bc2-cd5b-4f9c-aa1e-90e1916e0154	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:12.25	gm
06be72cb-a797-49d0-aab0-435062cba621	91ca2bc2-cd5b-4f9c-aa1e-90e1916e0154	81ee7d10-3404-4ae2-b740-8acf875e3ba2	100	13.00	13.00	100	130.00	1000	13.00	2025-09-27 15:42:12.251	gm
a6f69440-1e23-4529-a41e-982b5094c3cd	91ca2bc2-cd5b-4f9c-aa1e-90e1916e0154	97d66b60-b3da-41f0-a6b0-305cbb2fb464	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:12.252	gm
853725fc-d41f-463c-83bf-6d78b6162746	91ca2bc2-cd5b-4f9c-aa1e-90e1916e0154	de8e800e-c915-4d26-9ff5-94701f51222d	1	60.00	0.06	1	60.00	1000	0.06	2025-09-27 15:42:12.252	kg
51349268-9fdf-4f34-a4da-5f0f2e48a83e	91ca2bc2-cd5b-4f9c-aa1e-90e1916e0154	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	15	20.00	20.00	15	1.33	1	20.00	2025-09-27 15:42:12.253	pc
3184f2bf-c7fb-49c5-8a72-49c10d8326c6	91ca2bc2-cd5b-4f9c-aa1e-90e1916e0154	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	1	50.00	0.05	1	50.00	1000	0.05	2025-09-27 15:42:12.253	kg
5fe779a7-715c-493d-8b08-a1a7d1519aa8	91ca2bc2-cd5b-4f9c-aa1e-90e1916e0154	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:12.254	gm
64033e1c-c1f5-4c1e-9d5f-a77a68b51a83	91ca2bc2-cd5b-4f9c-aa1e-90e1916e0154	738a0900-9798-424c-a3f6-04a98bcf3848	2	60.00	0.12	2	60.00	1000	0.12	2025-09-27 15:42:12.255	kg
4e4fb59f-858b-4bd8-bb7a-fbe4cdfacd81	91ca2bc2-cd5b-4f9c-aa1e-90e1916e0154	6c1e3d72-7d97-40bb-97b4-93059631140f	4	60.00	60.00	4	15.00	1	60.00	2025-09-27 15:42:12.255	pc
e7ff27d3-3ac4-45de-834d-2a8d997f7578	91ca2bc2-cd5b-4f9c-aa1e-90e1916e0154	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:12.256	gm
b6ae100e-7649-4d7c-bb22-7ea768921162	e436780d-5e56-432c-80e8-a118a327560a	7fded13b-5795-4f23-a8ba-c1c830755b18	150	11.00	11.00	150	73.33	1000	11.00	2025-09-27 15:42:12.278	gm
7e1f4c40-ed81-48b2-811f-ce0b6b1300ee	e436780d-5e56-432c-80e8-a118a327560a	97d66b60-b3da-41f0-a6b0-305cbb2fb464	750	53.00	53.00	750	70.67	1000	53.00	2025-09-27 15:42:12.28	gm
a6802792-6632-497c-911a-cd7cd6d7adc4	e436780d-5e56-432c-80e8-a118a327560a	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.281	gm
43da160f-79d2-4514-90b7-412131de0724	e436780d-5e56-432c-80e8-a118a327560a	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:12.281	pc
a62eef4c-2d9a-4985-a78c-f78873343dbf	e436780d-5e56-432c-80e8-a118a327560a	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.282	gm
40b785c4-032d-4eec-8add-15d8e7e51427	e436780d-5e56-432c-80e8-a118a327560a	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:12.283	gm
c33a70a1-b533-4612-a1a2-3191306061fe	e436780d-5e56-432c-80e8-a118a327560a	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:12.283	gm
ed904781-8a98-4bbb-8412-16e74373f477	e436780d-5e56-432c-80e8-a118a327560a	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:12.284	gm
e2ffb0ac-cd8b-4969-aa67-7fd7c0c218f1	e436780d-5e56-432c-80e8-a118a327560a	cba9a138-b913-47df-b1fa-61663c7603b0	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:12.285	kg
44b8bc7d-4948-4c2e-a497-ab82bcdc7e15	e436780d-5e56-432c-80e8-a118a327560a	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	300	39.00	39.00	300	130.00	1000	39.00	2025-09-27 15:42:12.286	gm
f46c52ca-7e3a-4421-b12d-f4758b542df7	e436780d-5e56-432c-80e8-a118a327560a	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:12.286	gm
fb98499e-6069-41b0-886d-7ac4d763eeea	e436780d-5e56-432c-80e8-a118a327560a	738a0900-9798-424c-a3f6-04a98bcf3848	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.287	gm
18e0fbe2-e047-4754-a67d-45f2d46d87df	e436780d-5e56-432c-80e8-a118a327560a	682089ef-89e9-4860-bfe0-e286ada294dd	1	35.00	35.00	1	35.00	1	35.00	2025-09-27 15:42:12.287	pc
3c3851e9-eb23-4c19-b581-45eb76e5b6d7	df7c45a4-259a-4cfa-9424-3f7b17111bbf	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	13.00	13.00	250	52.00	1000	13.00	2025-09-27 15:42:12.306	gm
91e9db52-9435-4aba-8bd3-d1472a0bca39	df7c45a4-259a-4cfa-9424-3f7b17111bbf	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:12.307	gm
bedce07f-8830-4880-964f-aabd7abc2998	df7c45a4-259a-4cfa-9424-3f7b17111bbf	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:12.308	gm
802ea504-7f27-4c84-a241-5b013be3361e	df7c45a4-259a-4cfa-9424-3f7b17111bbf	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:12.308	gm
d9b2043a-17c8-4a0e-9781-6f40225d3ad4	df7c45a4-259a-4cfa-9424-3f7b17111bbf	feb933e8-b9cb-4046-978c-f8619c693eb5	500	60.00	60.00	500	120.00	1000	60.00	2025-09-27 15:42:12.309	gm
15f596f1-2c1b-443d-8e6a-b846004ba303	df7c45a4-259a-4cfa-9424-3f7b17111bbf	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:12.309	gm
7ea0be66-c549-42f9-b6ac-97f82e1bc560	df7c45a4-259a-4cfa-9424-3f7b17111bbf	de8e800e-c915-4d26-9ff5-94701f51222d	300	18.00	18.00	300	60.00	1000	18.00	2025-09-27 15:42:12.31	gm
5c6b4e1f-adf7-4106-9e20-12dba626fbb3	df7c45a4-259a-4cfa-9424-3f7b17111bbf	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:12.31	gm
e29a013a-045e-442e-bb6f-efb1a0e4c476	df7c45a4-259a-4cfa-9424-3f7b17111bbf	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:12.31	gm
f704f6ac-6b97-4767-a303-cdd546c9b6dc	45db82d2-05e6-4e53-9657-f6f96fd4b4c4	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:12.334	gm
efad1ed8-39f0-4ebf-b32c-d1ab859ca059	45db82d2-05e6-4e53-9657-f6f96fd4b4c4	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.337	gm
bc0fc42e-e092-4299-bdc3-3f4a3bed84a0	fa016562-70f4-485d-b87a-9521e754b04d	7fded13b-5795-4f23-a8ba-c1c830755b18	250	30.00	15.00	250	30.00	500	15.00	2025-10-02 14:23:24.423958	gm
19c123be-ed94-4016-be77-428c80379040	45db82d2-05e6-4e53-9657-f6f96fd4b4c4	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:12.338	gm
c9511b92-f630-486c-b2de-c1edc6f10097	45db82d2-05e6-4e53-9657-f6f96fd4b4c4	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:12.338	gm
3d79876d-e4bf-491c-956e-6238863544df	45db82d2-05e6-4e53-9657-f6f96fd4b4c4	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:12.339	gm
f8072045-ccac-4873-809d-e309a2d6d415	45db82d2-05e6-4e53-9657-f6f96fd4b4c4	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.339	gm
668355df-beeb-43bf-a044-707e7987a1ee	45db82d2-05e6-4e53-9657-f6f96fd4b4c4	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:12.34	kg
2135cf15-a95b-44d5-af06-12f2ce217186	45db82d2-05e6-4e53-9657-f6f96fd4b4c4	7fded13b-5795-4f23-a8ba-c1c830755b18	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:12.34	gm
ad220b75-9371-483e-a579-a5a1f5d866af	45db82d2-05e6-4e53-9657-f6f96fd4b4c4	de8e800e-c915-4d26-9ff5-94701f51222d	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:12.341	gm
db96ef6c-c8c6-46b8-a693-63ac65958c59	45db82d2-05e6-4e53-9657-f6f96fd4b4c4	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:12.341	gm
615a9560-213a-4542-ab2c-677fd09548a2	c5586e27-9a9e-467c-a623-d13123e28509	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.363	gm
b3587054-6398-4ee0-9ed9-6b4672314eb3	c5586e27-9a9e-467c-a623-d13123e28509	7fded13b-5795-4f23-a8ba-c1c830755b18	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:12.365	gm
39eb9005-4ebb-4c98-b22d-81b6a64e9d23	c5586e27-9a9e-467c-a623-d13123e28509	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	65.00	65.00	500	130.00	1000	65.00	2025-09-27 15:42:12.366	gm
ea056218-4bec-4abf-a91c-7ef4d6919440	c5586e27-9a9e-467c-a623-d13123e28509	0653ab92-5171-418b-89d2-9e6b60482bbb	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.367	gm
f71f9869-5db9-4c24-842c-ef16d86b8114	c5586e27-9a9e-467c-a623-d13123e28509	feb933e8-b9cb-4046-978c-f8619c693eb5	500	60.00	60.00	500	120.00	1000	60.00	2025-09-27 15:42:12.367	gm
deb27bf8-7bb9-4498-a863-7c9758f0b6a9	c5586e27-9a9e-467c-a623-d13123e28509	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	250	13.00	13.00	250	52.00	1000	13.00	2025-09-27 15:42:12.368	gm
c37088de-9a4e-4489-978d-32c971a69af4	960ccdd7-ca08-443c-aba2-d5edb0da5a61	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.385	gm
4b05f67c-8f4e-4dd0-a93a-a6931fe3e17f	960ccdd7-ca08-443c-aba2-d5edb0da5a61	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.386	gm
48021414-7037-43b8-8000-4274e0b9bf10	49b5e4fb-af4e-4fd0-a4d4-5bd99b361799	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:12.406	gm
3736db66-14a8-4db7-b57b-947734a410b4	49b5e4fb-af4e-4fd0-a4d4-5bd99b361799	de8e800e-c915-4d26-9ff5-94701f51222d	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:12.409	gm
5b0cd3d2-1641-44ad-b676-cb870efcc673	49b5e4fb-af4e-4fd0-a4d4-5bd99b361799	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:12.41	gm
6ce20410-4227-40da-ac32-ebe64e266984	49b5e4fb-af4e-4fd0-a4d4-5bd99b361799	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.411	gm
729a723d-ee12-42a1-97d4-1bf8540fdd98	49b5e4fb-af4e-4fd0-a4d4-5bd99b361799	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:12.412	kg
39109f0f-b3b6-4e5a-9337-d3d6c6770c53	49b5e4fb-af4e-4fd0-a4d4-5bd99b361799	682089ef-89e9-4860-bfe0-e286ada294dd	1	35.00	35.00	1	35.00	1	35.00	2025-09-27 15:42:12.412	pc
3d77dc81-267f-46d6-9978-3162c7a82a21	14032a8f-d7f2-480d-a3b9-dee3219a6fa1	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	1	50.00	0.05	1	50.00	1000	0.05	2025-09-27 15:42:12.446	kg
350ed9d4-5d7a-4309-af44-34ea80af2ef5	14032a8f-d7f2-480d-a3b9-dee3219a6fa1	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.45	gm
a8bc84ed-9ea4-478b-9091-9ce8a7d6ebf7	0b9f08f8-06be-419a-bdf7-7e698fb9ead6	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.474	gm
b3283197-8c34-48d2-85ff-c775d7f366f6	0b9f08f8-06be-419a-bdf7-7e698fb9ead6	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:12.476	kg
1e938721-e476-4a30-be71-fcad24f3178f	0b9f08f8-06be-419a-bdf7-7e698fb9ead6	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:12.478	gm
a0376ca7-4439-473c-a07e-eb040710332d	0b9f08f8-06be-419a-bdf7-7e698fb9ead6	cba9a138-b913-47df-b1fa-61663c7603b0	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:12.479	gm
5f68ad76-f73e-4cc8-a510-7a4a5214d3b4	0b9f08f8-06be-419a-bdf7-7e698fb9ead6	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:12.48	gm
77b02805-d788-43e3-8e48-483536820e40	22a1c1e8-6a5a-49db-ad80-e7f52bbd836b	35660cc6-d186-4b87-9c97-3c07bbc5303f	500	25.00	25.00	500	0.05	1	25.00	2025-09-27 15:42:12.51	pc
b7c60390-6610-4dc5-8246-8eb46b7f90dc	22a1c1e8-6a5a-49db-ad80-e7f52bbd836b	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-09-27 15:42:12.513	pc
19265b04-fdf9-46aa-b966-cec8254a5f1f	22a1c1e8-6a5a-49db-ad80-e7f52bbd836b	682089ef-89e9-4860-bfe0-e286ada294dd	1	30.00	30.00	1	30.00	1	30.00	2025-09-27 15:42:12.515	pc
9ba0fb4b-39ff-4342-9022-81836c67e90a	22a1c1e8-6a5a-49db-ad80-e7f52bbd836b	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.515	gm
7a6b3914-c5b2-4d3d-8da0-9ff4214b681c	22a1c1e8-6a5a-49db-ad80-e7f52bbd836b	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:12.516	kg
34def587-5d45-4327-a294-c10b2606443c	22a1c1e8-6a5a-49db-ad80-e7f52bbd836b	de8e800e-c915-4d26-9ff5-94701f51222d	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:12.517	gm
fd41defa-e598-4399-9fd3-ceeb8740138c	5ac2906d-b296-4765-81f2-ca825b4f25f6	cba9a138-b913-47df-b1fa-61663c7603b0	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:12.541	gm
683616da-424f-40bb-a2d5-05d72346fce0	5ac2906d-b296-4765-81f2-ca825b4f25f6	7fded13b-5795-4f23-a8ba-c1c830755b18	100	7.00	7.00	100	0.07	1	7.00	2025-09-27 15:42:12.544	pc
d307a81c-538b-4f67-b0e2-42f62e49caa5	5ac2906d-b296-4765-81f2-ca825b4f25f6	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.546	gm
3ac894de-9685-4be9-92aa-793cfe9bfbfe	5ac2906d-b296-4765-81f2-ca825b4f25f6	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	0.10	1	25.00	2025-09-27 15:42:12.546	pc
c2cbb5f0-e366-492a-83e5-cbd1da703615	5ac2906d-b296-4765-81f2-ca825b4f25f6	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:12.547	kg
42adde76-c875-47d4-a284-44aa9d5d3764	5ac2906d-b296-4765-81f2-ca825b4f25f6	de8e800e-c915-4d26-9ff5-94701f51222d	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:12.548	gm
25851087-fee0-44e3-95f7-6958feae120d	5ac2906d-b296-4765-81f2-ca825b4f25f6	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	99	15.00	15.00	99	0.15	1	15.00	2025-09-27 15:42:12.548	pc
81d74a5e-9810-48c8-b2d8-8e70325e1747	91fa4737-01f0-417c-b7a2-f7925df81472	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.582	gm
514a0478-6671-4831-8b39-8366f317b232	91fa4737-01f0-417c-b7a2-f7925df81472	682089ef-89e9-4860-bfe0-e286ada294dd	1	30.00	30.00	1	30.00	1	30.00	2025-09-27 15:42:12.585	pc
87de61d6-cd57-48b8-b637-f0c851d7d83a	91fa4737-01f0-417c-b7a2-f7925df81472	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:12.586	gm
e94b9e2b-8558-4215-8e5d-9ff6860ff127	91fa4737-01f0-417c-b7a2-f7925df81472	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.586	gm
d05a0b88-64f3-45dc-b80b-9d52a4f54684	91fa4737-01f0-417c-b7a2-f7925df81472	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	33.00	33.00	250	132.00	1000	33.00	2025-09-27 15:42:12.587	gm
fc3fda8a-5a77-4e32-94e6-248edd467ae6	91fa4737-01f0-417c-b7a2-f7925df81472	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-09-27 15:42:12.588	pc
77aab3b3-b7cd-4382-b75d-36902d3f2aa3	91fa4737-01f0-417c-b7a2-f7925df81472	738a0900-9798-424c-a3f6-04a98bcf3848	2	60.00	0.12	2	60.00	1000	0.12	2025-09-27 15:42:12.588	kg
00eb96cf-a42c-4d11-9a94-e7e05d94d9b9	61e36f4b-4963-4408-bfd9-88c3df6f2ac4	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.611	gm
1b6e8e1f-3fe4-46fd-a3de-c0cc721dff61	61e36f4b-4963-4408-bfd9-88c3df6f2ac4	6c1e3d72-7d97-40bb-97b4-93059631140f	4	60.00	60.00	4	15.00	1	60.00	2025-09-27 15:42:12.614	pc
4b1bd1d6-f720-4527-8094-f210153f179c	61e36f4b-4963-4408-bfd9-88c3df6f2ac4	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:12.615	gm
c937fc0f-79ab-41c0-a40c-3fcb673f9537	61e36f4b-4963-4408-bfd9-88c3df6f2ac4	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.615	gm
ae49969d-dbc9-446d-b62e-891fbcd9b966	61e36f4b-4963-4408-bfd9-88c3df6f2ac4	738a0900-9798-424c-a3f6-04a98bcf3848	2	60.00	0.12	2	60.00	1000	0.12	2025-09-27 15:42:12.616	kg
0f2362f2-5bc9-4035-9246-3596b4ff0967	61e36f4b-4963-4408-bfd9-88c3df6f2ac4	7fded13b-5795-4f23-a8ba-c1c830755b18	100	7.00	7.00	100	70.00	1000	7.00	2025-09-27 15:42:12.617	gm
32ae9c3c-eb6f-40cc-9e43-70083cdf766e	61e36f4b-4963-4408-bfd9-88c3df6f2ac4	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:12.618	gm
29c6f7c1-5f88-4108-9638-bec87daecb97	7cc7a9e1-7ef3-4514-9410-89ddb645aa61	cba9a138-b913-47df-b1fa-61663c7603b0	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:12.641	gm
f7889853-29b7-4696-8efe-6defd4413a89	fa016562-70f4-485d-b87a-9521e754b04d	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	25.00	12.50	250	25.00	500	12.50	2025-10-02 14:23:24.423958	gm
e3060f5a-6f2e-4b61-bab5-13f088581cea	7cc7a9e1-7ef3-4514-9410-89ddb645aa61	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:12.643	gm
efa60ea9-717b-441d-85c1-ee498d6cfce6	7cc7a9e1-7ef3-4514-9410-89ddb645aa61	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.644	gm
edd73ce8-e3e3-4f99-bae5-e73a5fc30baf	7cc7a9e1-7ef3-4514-9410-89ddb645aa61	0653ab92-5171-418b-89d2-9e6b60482bbb	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.645	gm
c3634f43-5095-4e8f-92d3-5f00c3dd74e1	7cc7a9e1-7ef3-4514-9410-89ddb645aa61	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:12.646	kg
02623895-0d60-4008-88fe-0f3169e3fd89	afaf9670-50ca-4039-843e-e98e8b5a598f	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.669	gm
372607b5-3a0d-48f1-9df4-0085f061707a	afaf9670-50ca-4039-843e-e98e8b5a598f	cba9a138-b913-47df-b1fa-61663c7603b0	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:12.671	gm
14f85580-8b79-4311-a112-dd8e0543fb28	afaf9670-50ca-4039-843e-e98e8b5a598f	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.673	gm
0503c958-c872-4f0e-92ce-daa2c211b758	d11d039d-4eb4-4cd7-a15b-5835f4bc49b9	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.694	gm
d282b519-8171-4b0b-b11e-e733b068f881	d11d039d-4eb4-4cd7-a15b-5835f4bc49b9	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:12.695	gm
4454e047-0e48-4fb4-810d-0938529e4384	65916c58-7a94-4f9b-8692-4e26884a594e	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.719	gm
f4473460-ba1e-44d0-9dda-4f7993de41d5	65916c58-7a94-4f9b-8692-4e26884a594e	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:12.72	gm
424f160c-520f-45d9-8c73-df05259a2e6e	65916c58-7a94-4f9b-8692-4e26884a594e	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:12.721	gm
097f29f1-c760-41a0-b93f-420b386de50e	65916c58-7a94-4f9b-8692-4e26884a594e	682089ef-89e9-4860-bfe0-e286ada294dd	1	30.00	30.00	1	30.00	1	30.00	2025-09-27 15:42:12.722	pc
3b3fe6e6-4716-4ca3-bb0e-295697ebab64	b284a663-1cf0-46d9-bdb4-05e5472cd1c6	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:12.742	gm
16f26c73-c203-4851-9c83-6fca3348923f	b284a663-1cf0-46d9-bdb4-05e5472cd1c6	6c1e3d72-7d97-40bb-97b4-93059631140f	3	45.00	45.00	3	15.00	1	45.00	2025-09-27 15:42:12.745	pc
b408975c-af27-48e2-8996-00a1a4f3c981	b284a663-1cf0-46d9-bdb4-05e5472cd1c6	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.746	gm
0f212dfb-f663-4c00-96df-6f2b6ec978eb	b284a663-1cf0-46d9-bdb4-05e5472cd1c6	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.747	gm
6dacf3f9-8e14-4c5e-b88e-16f0f4016bfd	b284a663-1cf0-46d9-bdb4-05e5472cd1c6	bd71ec96-c096-496b-9993-b560661cbb48	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.747	gm
cc068841-292b-41d8-bb1a-73866958ed87	b284a663-1cf0-46d9-bdb4-05e5472cd1c6	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:12.748	gm
884e8baf-d3c3-4f6a-bc5e-6d34108723f7	d03fa9b8-16bf-4052-8474-4a6832dd42ad	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.771	gm
8279d9cc-229b-445e-91bb-09726fa64fc3	d03fa9b8-16bf-4052-8474-4a6832dd42ad	738a0900-9798-424c-a3f6-04a98bcf3848	2	60.00	0.12	2	60.00	1000	0.12	2025-09-27 15:42:12.773	kg
950d3670-df5f-432b-867a-367340950082	d03fa9b8-16bf-4052-8474-4a6832dd42ad	682089ef-89e9-4860-bfe0-e286ada294dd	1	30.00	30.00	1	30.00	1	30.00	2025-09-27 15:42:12.774	pc
33c8a34b-b3d6-40a9-a467-0a7943cb3191	d03fa9b8-16bf-4052-8474-4a6832dd42ad	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-09-27 15:42:12.775	pc
e8e923e7-c89d-4002-933b-34ccef7ebe20	d03fa9b8-16bf-4052-8474-4a6832dd42ad	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:12.775	gm
ac6ff474-ab49-471a-b47a-3e03f7afdf20	d03fa9b8-16bf-4052-8474-4a6832dd42ad	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.776	gm
c1559459-2f1f-4f89-966c-a79910952da7	d03fa9b8-16bf-4052-8474-4a6832dd42ad	7fded13b-5795-4f23-a8ba-c1c830755b18	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:12.777	gm
5496eed4-dc51-4c10-b706-342eeeebd71f	d03fa9b8-16bf-4052-8474-4a6832dd42ad	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:12.778	gm
8c992ae5-e48a-4c4e-8164-fa0cd05123d6	d03fa9b8-16bf-4052-8474-4a6832dd42ad	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	28.00	28.00	250	112.00	1000	28.00	2025-09-27 15:42:12.779	gm
6824e5f7-49fb-4672-baf2-b76c931b3b5d	d03fa9b8-16bf-4052-8474-4a6832dd42ad	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:12.779	gm
43cabaec-06f1-47b1-831b-cf10aebed0b0	35c19c09-bf32-48e4-b429-9f829b69c29f	be7965d2-e7ae-42dd-9731-b1195135005e	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.802	gm
fe414dae-8cae-437e-8920-c128be25c21c	35c19c09-bf32-48e4-b429-9f829b69c29f	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:12.804	gm
6e67af14-a8c9-41bd-affd-1dbed05eddd1	35c19c09-bf32-48e4-b429-9f829b69c29f	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:12.805	gm
fbb98deb-3713-4db6-9ea8-711e025570ce	35c19c09-bf32-48e4-b429-9f829b69c29f	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:12.806	kg
0f263936-4e1d-41f8-835d-0c05b660c91e	35c19c09-bf32-48e4-b429-9f829b69c29f	cba9a138-b913-47df-b1fa-61663c7603b0	1	60.00	0.06	1	60.00	1000	0.06	2025-09-27 15:42:12.807	kg
2a663215-7e4d-4428-8b17-7b3bc4079303	493bbffe-b188-4d1b-8870-8cc87baceef2	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.826	gm
c4aa3be2-23db-4528-9a02-6e7ef70f02b7	493bbffe-b188-4d1b-8870-8cc87baceef2	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:12.828	gm
a26c7587-c20f-47aa-b357-724b85c287e9	493bbffe-b188-4d1b-8870-8cc87baceef2	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.828	gm
03a8e6ac-de0e-4f91-a9d5-fbf9219785e8	493bbffe-b188-4d1b-8870-8cc87baceef2	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.829	gm
7bdc3627-dd4d-44e3-b176-934418435f8a	493bbffe-b188-4d1b-8870-8cc87baceef2	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:12.83	gm
7049bedf-f519-4318-ace1-f71955bfd36a	493bbffe-b188-4d1b-8870-8cc87baceef2	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:12.831	gm
4bf0d365-b01f-4d3c-9932-33c68a725846	493bbffe-b188-4d1b-8870-8cc87baceef2	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:12.832	gm
049d666d-d789-4afc-bfec-2d27d7d968f0	493bbffe-b188-4d1b-8870-8cc87baceef2	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:12.832	gm
ff7ea806-661b-4891-af01-3999aa008c96	493bbffe-b188-4d1b-8870-8cc87baceef2	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:12.833	kg
debf6e67-f3bc-44fa-9164-1be81d67191a	6fb38e7e-34db-4483-88fa-165a780eb550	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.854	gm
91640c13-5b2d-4d0a-945e-e92646cdb4c3	6fb38e7e-34db-4483-88fa-165a780eb550	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.857	gm
e841114d-ba62-4dd4-8ffa-57a07c701961	6fb38e7e-34db-4483-88fa-165a780eb550	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:12.858	kg
648f1933-e65a-4060-af76-c4e0cf3667a8	6fb38e7e-34db-4483-88fa-165a780eb550	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:12.859	gm
0189dd08-c0cf-47da-a5ea-b972e7d201ff	6fb38e7e-34db-4483-88fa-165a780eb550	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:12.86	gm
ccd0eb04-8dc0-4dfa-9c11-514984cbc38a	6fb38e7e-34db-4483-88fa-165a780eb550	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:12.861	gm
5995ee6f-18b6-411b-904e-6e25ed5846f9	6fb38e7e-34db-4483-88fa-165a780eb550	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:12.862	gm
12d683b4-09e8-45ab-8d3e-2a56058e9846	6fb38e7e-34db-4483-88fa-165a780eb550	7fded13b-5795-4f23-a8ba-c1c830755b18	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:12.862	gm
fd1471d0-ae7c-41b3-9b5d-d5edfbaae29e	6fb38e7e-34db-4483-88fa-165a780eb550	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:12.863	gm
6650c03d-bda7-4862-bc3e-ef72775a04b5	61f01f8c-1dda-4fb1-b51b-131a4613f856	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.893	gm
f5f01186-335a-4af3-87fa-c01f4e769203	61f01f8c-1dda-4fb1-b51b-131a4613f856	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:12.895	kg
7d24cc07-a947-4819-b8ee-415c1e269127	61f01f8c-1dda-4fb1-b51b-131a4613f856	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:12.896	gm
51022239-3f6d-4f2e-b2b6-bd953c1d3f63	61f01f8c-1dda-4fb1-b51b-131a4613f856	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	28.00	28.00	250	112.00	1000	28.00	2025-09-27 15:42:12.898	gm
91b61813-9d6f-4e68-b014-e51d126a2e96	61f01f8c-1dda-4fb1-b51b-131a4613f856	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:12.899	gm
f0432fc7-f3ec-40ad-9500-5353d88eda1f	61f01f8c-1dda-4fb1-b51b-131a4613f856	0653ab92-5171-418b-89d2-9e6b60482bbb	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.9	gm
c399569a-9f5f-47f5-92cd-a9bf6111b9e4	f0568140-ca00-4ade-98a6-9d24aa060786	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:05.588	gm
38eda125-6410-4e4e-b379-a6540c5e3a56	f0568140-ca00-4ade-98a6-9d24aa060786	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:05.591	gm
c0065911-7c95-4e97-88bd-591ccd50b7ae	f0568140-ca00-4ade-98a6-9d24aa060786	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:05.593	gm
59bbe66a-d57c-4855-afc0-551c1e829265	f0568140-ca00-4ade-98a6-9d24aa060786	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:05.594	gm
744322db-481f-42ee-9b45-6fa0f6528a73	29306dc3-06bc-4801-8bea-9cf31cee3e1a	738a0900-9798-424c-a3f6-04a98bcf3848	2	70.00	0.14	2	70.00	1000	0.14	2025-09-27 15:42:05.614	kg
3dc24521-c76e-490a-b169-fa009b02cb1b	29306dc3-06bc-4801-8bea-9cf31cee3e1a	cba9a138-b913-47df-b1fa-61663c7603b0	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:05.615	kg
bb27d2cd-cf39-4486-8be8-31e6264469c1	29306dc3-06bc-4801-8bea-9cf31cee3e1a	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:05.617	gm
0c8c265b-1186-4241-b506-287e5a2ff004	4d1f4772-d1ca-4a45-a79c-26604707f93d	cba9a138-b913-47df-b1fa-61663c7603b0	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:05.638	gm
cafd54c7-1c5b-4134-b296-2db3e65fa788	4d1f4772-d1ca-4a45-a79c-26604707f93d	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:05.64	gm
99c127dd-73c1-4ef0-9e6d-43b831591d35	4d1f4772-d1ca-4a45-a79c-26604707f93d	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:05.641	gm
0fa28f34-fe16-4d5a-ad3c-9224da0f9418	4d1f4772-d1ca-4a45-a79c-26604707f93d	7687b526-7d4f-40e5-b274-c66cca337009	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:05.642	gm
415aee69-619a-4575-b031-11c85698b9e5	4d1f4772-d1ca-4a45-a79c-26604707f93d	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	100	6.00	6.00	100	60.00	1000	6.00	2025-09-27 15:42:05.643	gm
90e47d60-76ae-4efa-8aaf-deb680058223	ec4ca6bb-cdb6-4c32-9330-7ed5e0149589	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:05.668	gm
e53b53b0-a7c0-47e5-bc97-ae83891342af	ec4ca6bb-cdb6-4c32-9330-7ed5e0149589	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:05.669	gm
a9e7b32d-abb9-4f29-bef1-a83ac5244df4	ec4ca6bb-cdb6-4c32-9330-7ed5e0149589	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:05.67	gm
865f3db6-296d-47d5-a78f-7b5856554a26	ec4ca6bb-cdb6-4c32-9330-7ed5e0149589	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:05.671	gm
d8a465b3-d213-49be-83ec-830dd7533b90	d9530e1b-974d-4b14-bf0a-73e54a76cb24	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:05.707	gm
6dcc6de3-2756-485c-9986-3a59b0228bdd	d9530e1b-974d-4b14-bf0a-73e54a76cb24	682089ef-89e9-4860-bfe0-e286ada294dd	1000	60.00	60.00	1000	60.00	1000	60.00	2025-09-27 15:42:05.71	gm
1088fc6b-28d6-4d04-8de5-c47da40511d5	d9530e1b-974d-4b14-bf0a-73e54a76cb24	7687b526-7d4f-40e5-b274-c66cca337009	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:05.711	gm
0bf24a79-f31b-4b69-96f8-b24fd8f462d5	d9530e1b-974d-4b14-bf0a-73e54a76cb24	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:05.712	gm
d5bd2185-b841-47b4-9992-eb85fd29e667	d9530e1b-974d-4b14-bf0a-73e54a76cb24	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:05.713	gm
f02c9baa-5039-4bfd-9b5d-3ad596c0689a	d9530e1b-974d-4b14-bf0a-73e54a76cb24	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	60.00	60.00	500	120.00	1000	60.00	2025-09-27 15:42:05.714	gm
4748841d-2cb2-4b3e-bbb9-8cc6d7d028c9	5ecc55a7-c1d6-4018-a81d-ecf44b3f193b	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:05.735	gm
620f1ba4-c1be-4ac9-bb87-2d35ce3cde0d	5ecc55a7-c1d6-4018-a81d-ecf44b3f193b	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:05.737	gm
a48a3845-4d3d-4beb-abc3-3e6a99387a64	5ecc55a7-c1d6-4018-a81d-ecf44b3f193b	cba9a138-b913-47df-b1fa-61663c7603b0	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:05.738	gm
9950b016-4a4a-44c3-a822-9e335a5fde87	5ecc55a7-c1d6-4018-a81d-ecf44b3f193b	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:05.739	gm
b794bb7c-77ff-4885-b1d5-3ea99abeefa1	b3176d4f-c79e-40e8-bb95-63dd49931812	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:05.758	gm
8db7e0fa-f6a1-4d01-8cb0-75b7de01f333	b3176d4f-c79e-40e8-bb95-63dd49931812	be7965d2-e7ae-42dd-9731-b1195135005e	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:05.759	kg
8568feae-67c1-48b4-94c8-ceeeb17ddedf	5890dfd7-cec5-4020-b58b-c23b10e8d103	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:05.781	gm
a1e76b23-9b5d-4d97-828b-5fbcf1bfa0c6	5890dfd7-cec5-4020-b58b-c23b10e8d103	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:05.783	gm
bd928069-7638-4a9b-a4b0-a8ec22ca4d87	5890dfd7-cec5-4020-b58b-c23b10e8d103	be7965d2-e7ae-42dd-9731-b1195135005e	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:05.784	kg
a0d0f173-bb9e-459c-841f-917fcfec7a7a	29e4904b-0d01-4ba1-9d39-f8309c6330e3	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:05.808	gm
e2fd4124-e9af-49e7-919b-b86c043397ed	29e4904b-0d01-4ba1-9d39-f8309c6330e3	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:05.81	gm
8bd11c93-8672-459f-8233-8959938ded8a	29e4904b-0d01-4ba1-9d39-f8309c6330e3	682089ef-89e9-4860-bfe0-e286ada294dd	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:05.812	gm
b97a434c-8350-4b89-8b3a-c8e826705403	29e4904b-0d01-4ba1-9d39-f8309c6330e3	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:05.812	gm
0c278ec9-fe84-4d7a-aa3e-5d75481bc824	29e4904b-0d01-4ba1-9d39-f8309c6330e3	0653ab92-5171-418b-89d2-9e6b60482bbb	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:05.813	gm
afa3320f-3fce-47e2-ae60-0fd091b531b8	29e4904b-0d01-4ba1-9d39-f8309c6330e3	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:05.814	gm
8c86073c-9bcb-4065-bcb0-3ed0d8f50d07	5dc7998c-18ab-4adc-9d05-3e3b33fa6b39	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:05.836	gm
04f98afc-af6b-4d2e-a068-8642f5d6c317	5dc7998c-18ab-4adc-9d05-3e3b33fa6b39	be7965d2-e7ae-42dd-9731-b1195135005e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:05.839	gm
95ec771a-2bc1-4b07-8c07-f58451fab7ef	5dc7998c-18ab-4adc-9d05-3e3b33fa6b39	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:05.84	gm
b85715e5-b412-4ad3-9804-32ecfc41f44b	5dc7998c-18ab-4adc-9d05-3e3b33fa6b39	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:05.841	gm
624234c2-4833-4411-a3d4-9c4c90e445c1	5dc7998c-18ab-4adc-9d05-3e3b33fa6b39	0653ab92-5171-418b-89d2-9e6b60482bbb	1	60.00	0.06	1	60.00	1000	0.06	2025-09-27 15:42:05.842	kg
d8ae6cfb-dc34-4c44-bf76-dfd29778729a	253d402a-ab33-444e-a703-7487a45826e1	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	60.00	60.00	500	120.00	1000	60.00	2025-09-27 15:42:05.862	gm
04de4a3d-6fdb-4722-9955-1b7cd86ebb00	253d402a-ab33-444e-a703-7487a45826e1	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:05.864	gm
93ddb9dd-1198-41a6-a92d-80d5ce593ae5	d9ba2f1d-ff0f-43df-a975-099f8a91987f	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:05.885	gm
e1ce8433-425a-4357-9dea-86851b1e4b02	d9ba2f1d-ff0f-43df-a975-099f8a91987f	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:05.887	gm
b3378ee1-a45f-47d7-bb5b-2c7e1e7d44ca	d9ba2f1d-ff0f-43df-a975-099f8a91987f	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:05.889	gm
6bd5162e-70cc-45c5-b4cd-513526e1f8b9	d9ba2f1d-ff0f-43df-a975-099f8a91987f	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:05.89	gm
fac9209d-ac3c-43b2-b4ad-911ed3f026f0	76445d34-0cc7-4769-9c1d-c23dfe8fc91e	97d66b60-b3da-41f0-a6b0-305cbb2fb464	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:05.91	gm
e858a005-6d58-4c5e-90ec-0098059dd951	76445d34-0cc7-4769-9c1d-c23dfe8fc91e	be7965d2-e7ae-42dd-9731-b1195135005e	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:05.912	kg
efcd24ef-77bb-46d9-93e4-5c43131bf88d	65ca599b-fe88-406c-95f3-7cb44ad62d71	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:05.938	gm
e9d17bc8-c38a-4f68-a65b-addd9a7ec40a	f80e4c90-1bd9-47c1-a3fc-918d7650ffe6	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:05.961	gm
4564339e-433a-46fb-ae8a-6075fe1bb007	f80e4c90-1bd9-47c1-a3fc-918d7650ffe6	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:05.964	gm
79cfe7ec-7e62-4bc9-9a79-608e05a209a8	f80e4c90-1bd9-47c1-a3fc-918d7650ffe6	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:05.965	gm
cb71398d-7884-4fc5-8b45-216416abccee	f80e4c90-1bd9-47c1-a3fc-918d7650ffe6	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:05.966	gm
d8706c02-88fb-4a78-a0f2-f064f3c1f725	f80e4c90-1bd9-47c1-a3fc-918d7650ffe6	2eae0636-1fa4-4d47-855f-306125787b1e	250	20.00	20.00	250	80.00	1000	20.00	2025-09-27 15:42:05.967	gm
3d23071f-4013-4e27-99b2-35d91cd92a48	60470190-5afe-475c-a59e-7c218f192b66	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:05.995	gm
083169f9-24e4-40fc-98fb-a7380e3aa3aa	92947482-0b78-4431-91f3-d8bc9a280593	be7965d2-e7ae-42dd-9731-b1195135005e	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:06.017	kg
05d25d59-f922-4fbb-907e-6fa01d67c440	92947482-0b78-4431-91f3-d8bc9a280593	be7965d2-e7ae-42dd-9731-b1195135005e	2	160.00	0.32	2	160.00	1000	0.32	2025-09-27 15:42:06.02	kg
181400e5-e470-45da-99a7-168c0e31156c	92947482-0b78-4431-91f3-d8bc9a280593	be7965d2-e7ae-42dd-9731-b1195135005e	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:06.021	kg
ea878746-0369-461f-9590-2887d0118789	34b3bd66-4972-4549-9122-dca80be6e778	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	60.00	60.00	500	120.00	1000	60.00	2025-09-27 15:42:06.043	gm
72876671-756f-4286-9107-d793367f40f9	34b3bd66-4972-4549-9122-dca80be6e778	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.046	gm
2f017800-b62c-4ca7-9eea-85925148252b	34b3bd66-4972-4549-9122-dca80be6e778	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:06.047	gm
7573c0f2-171a-42e9-bcce-6303159ff624	34b3bd66-4972-4549-9122-dca80be6e778	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.048	gm
8f6e4c61-cf46-42d4-896d-6f685b7d5ef6	769c9d04-46b7-4dac-a517-6ebd522131ca	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.072	gm
157805da-d993-4398-bc61-98d106773b59	769c9d04-46b7-4dac-a517-6ebd522131ca	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.074	gm
6ec5e5b1-8143-4e18-9f44-ee04f51d8f3b	a77f8411-7105-46ae-b484-9b5976cdbf38	be7965d2-e7ae-42dd-9731-b1195135005e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.097	gm
b08898c2-111c-4b83-b9b6-3e1828e259fc	a77f8411-7105-46ae-b484-9b5976cdbf38	738a0900-9798-424c-a3f6-04a98bcf3848	1	35.00	0.04	1	35.00	1000	0.04	2025-09-27 15:42:06.1	kg
2031fc8b-815a-4977-a20e-25eff8189a17	6b319518-cd3d-42b8-b5b3-9e74548c4c6e	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:06.127	gm
2cddf64a-d8c3-47a7-b58c-54386338b2b7	6b319518-cd3d-42b8-b5b3-9e74548c4c6e	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.129	gm
93a37f5b-962d-46d4-a5f8-d9989ac2c1ec	6b319518-cd3d-42b8-b5b3-9e74548c4c6e	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.13	gm
2cde135b-1a2b-4c43-9c45-64ba8ce1af7b	6b319518-cd3d-42b8-b5b3-9e74548c4c6e	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:06.131	pc
57a215c9-65ec-4b09-afe5-c0499678c7f0	6b319518-cd3d-42b8-b5b3-9e74548c4c6e	2eae0636-1fa4-4d47-855f-306125787b1e	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.132	gm
323f2ad0-fc0e-4897-ab82-e0798745e483	6b319518-cd3d-42b8-b5b3-9e74548c4c6e	0653ab92-5171-418b-89d2-9e6b60482bbb	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.133	gm
6d30f267-4562-48a2-98f6-67164fa2de32	6b319518-cd3d-42b8-b5b3-9e74548c4c6e	cba9a138-b913-47df-b1fa-61663c7603b0	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.133	gm
5360890c-1075-4766-b926-1191c0a88548	1d846bd3-6b44-42d1-84af-ae38a9941f0d	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:06.236	pc
eaa5eaae-d7f1-4931-9b86-e58f08360d3f	1d846bd3-6b44-42d1-84af-ae38a9941f0d	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:06.239	gm
420bebbf-18b7-490e-b307-f0afb1f60d92	fa016562-70f4-485d-b87a-9521e754b04d	0653ab92-5171-418b-89d2-9e6b60482bbb	300	30.00	18.00	300	30.00	500	18.00	2025-10-02 14:23:24.423958	gm
0ca1e5b4-3640-48b4-9674-8ecd69465cef	fa016562-70f4-485d-b87a-9521e754b04d	6c1e3d72-7d97-40bb-97b4-93059631140f	5	20.00	100.00	5	20.00	1	100.00	2025-10-02 14:23:24.423958	pc
06915d1c-0c3d-41fd-8366-a99579ad2631	fa016562-70f4-485d-b87a-9521e754b04d	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-02 14:23:24.423958	gm
e3b4ed45-676b-4baa-aef6-0ee458da9abf	fa016562-70f4-485d-b87a-9521e754b04d	738a0900-9798-424c-a3f6-04a98bcf3848	2	30.00	60.00	2	30.00	1000	60.00	2025-10-02 14:23:24.423958	kg
638c2366-b880-4dfc-aa5f-8b2231b318cb	efad2c03-3926-437b-bf3c-46d61353d458	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-07 14:47:21.445944	pc
2abc81c9-c07c-40e0-a274-8c4f1dc521a8	efad2c03-3926-437b-bf3c-46d61353d458	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	750	30.00	45.00	750	30.00	500	45.00	2025-10-07 14:47:21.445944	gm
436acdda-3950-49d2-9b75-8243f76d4cd4	efad2c03-3926-437b-bf3c-46d61353d458	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	60.00	30.00	250	60.00	500	30.00	2025-10-07 14:47:21.445944	gm
e11131b3-a458-4980-b26e-a5d80318e5cb	efad2c03-3926-437b-bf3c-46d61353d458	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	50.00	500	50.00	2025-10-07 14:47:21.445944	gm
edaf2b9e-0278-41aa-9437-2c3ae502b157	efad2c03-3926-437b-bf3c-46d61353d458	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-10-07 14:47:21.445944	gm
85c7c55c-f398-452c-823d-1d1068662e1a	efad2c03-3926-437b-bf3c-46d61353d458	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	70.00	35.00	250	70.00	500	35.00	2025-10-07 14:47:21.445944	gm
d237294e-2b47-4c8e-a0e8-8a2d7765a427	efad2c03-3926-437b-bf3c-46d61353d458	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 14:47:21.445944	gm
f6f9f38f-7d29-4145-865f-fad2caaf305a	efad2c03-3926-437b-bf3c-46d61353d458	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	75.00	37.50	250	75.00	500	37.50	2025-10-07 14:47:21.445944	gm
95801608-6eed-4423-b889-4e3d701d7247	25d01dac-4465-4c93-bf45-022cea33aad3	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	55.00	27.50	250	55.00	500	27.50	2025-09-27 14:39:46.785481	gm
c5ba7050-296e-4dc7-9b1d-538776229113	25d01dac-4465-4c93-bf45-022cea33aad3	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	40.00	20.00	250	40.00	500	20.00	2025-09-27 14:39:46.785481	gm
07c0c743-72cc-4582-9f24-13ddd7b8658e	25d01dac-4465-4c93-bf45-022cea33aad3	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-09-27 14:39:46.785481	pc
aaead2e6-c600-4022-b8f4-6b60c4fcbf5e	25d01dac-4465-4c93-bf45-022cea33aad3	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	25.00	500	25.00	2025-09-27 14:39:46.785481	gm
b3771daf-9ab3-4129-94e1-298525585eca	657e1132-73ba-461f-8d4b-e5d8a9631958	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	20.00	20.00	100	20.00	100	20.00	2025-10-02 14:24:41.384846	gm
341f1cac-77fa-416d-a37f-7def6238ac5d	657e1132-73ba-461f-8d4b-e5d8a9631958	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	30.00	15.00	250	30.00	500	15.00	2025-10-02 14:24:41.384846	gm
9e81d12a-b2c2-47f7-8d98-0aa7650a5243	657e1132-73ba-461f-8d4b-e5d8a9631958	371c3ff4-639a-46a2-8103-95906e93fb5e	250	50.00	25.00	250	50.00	500	25.00	2025-10-02 14:24:41.384846	gm
92dcff97-602b-43a5-a780-f510f296adce	657e1132-73ba-461f-8d4b-e5d8a9631958	97d66b60-b3da-41f0-a6b0-305cbb2fb464	250	35.00	17.50	250	35.00	500	17.50	2025-10-02 14:24:41.384846	gm
4b18d487-e875-46b6-b0ba-20500c2b3145	a39137f2-f513-47b0-bbe6-07ac20496275	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 14:49:23.956872	gm
1d6cdc19-c05c-4e23-85d9-4ff5d5999425	a39137f2-f513-47b0-bbe6-07ac20496275	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	30.00	15.00	250	30.00	500	15.00	2025-10-07 14:49:23.956872	gm
949bf8ae-d21d-4abb-acc7-b20697e30017	a39137f2-f513-47b0-bbe6-07ac20496275	682089ef-89e9-4860-bfe0-e286ada294dd	1	20.00	20.00	1	20.00	1	20.00	2025-10-07 14:49:23.956872	pc
be6b6b81-e080-4371-8874-afb5b421dc71	a39137f2-f513-47b0-bbe6-07ac20496275	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	30.00	500	30.00	2025-10-07 14:49:23.956872	gm
47d91ea9-7d72-45eb-bf26-ab0c854b3bd5	a39137f2-f513-47b0-bbe6-07ac20496275	0653ab92-5171-418b-89d2-9e6b60482bbb	250	30.00	15.00	250	30.00	500	15.00	2025-10-07 14:49:23.956872	gm
7e89dd3e-1c9b-4557-bdfa-212062234e70	a39137f2-f513-47b0-bbe6-07ac20496275	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	250	50.00	25.00	250	50.00	500	25.00	2025-10-07 14:49:23.956872	gm
c426adfe-bd41-4497-b9a5-680b79a3c355	a39137f2-f513-47b0-bbe6-07ac20496275	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	20.00	50.00	250	20.00	100	50.00	2025-10-07 14:49:23.956872	gm
9891bb54-2b46-4548-8766-eb59b81420d9	a39137f2-f513-47b0-bbe6-07ac20496275	be7965d2-e7ae-42dd-9731-b1195135005e	250	50.00	25.00	250	50.00	500	25.00	2025-10-07 14:49:23.956872	gm
05c28392-6ffb-4a25-adca-4acce6f18e65	1d846bd3-6b44-42d1-84af-ae38a9941f0d	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.239	gm
5f473e3c-4661-49ae-b6ca-1bd021e8a872	1d846bd3-6b44-42d1-84af-ae38a9941f0d	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.24	gm
fb0c7af7-4183-419e-97c6-58e2179db908	877a14c4-56b4-4c73-80b6-f07ee3be6487	81ee7d10-3404-4ae2-b740-8acf875e3ba2	300	30.00	30.00	300	100.00	1000	30.00	2025-09-27 15:42:06.276	gm
276c1668-6734-4ee0-a165-cacc083c1c55	877a14c4-56b4-4c73-80b6-f07ee3be6487	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	300	30.00	30.00	300	100.00	1000	30.00	2025-09-27 15:42:06.278	gm
54d7c806-d4e0-482a-a488-efa25ddcaf71	877a14c4-56b4-4c73-80b6-f07ee3be6487	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	100	12.00	12.00	100	120.00	1000	12.00	2025-09-27 15:42:06.278	gm
93e1e878-fe31-4788-8aec-4b05b4a54fd8	877a14c4-56b4-4c73-80b6-f07ee3be6487	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	40.00	40.00	500	80.00	1000	40.00	2025-09-27 15:42:06.279	gm
8522aba0-3195-470e-98a5-487aa69ba7cf	877a14c4-56b4-4c73-80b6-f07ee3be6487	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	300	21.00	21.00	300	70.00	1000	21.00	2025-09-27 15:42:06.279	gm
1038518f-4da0-4857-85fa-b3e2e52d2d6b	52c69a50-612c-45f4-8246-0418f7ac6212	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.302	gm
66ecc635-df82-4c8b-b423-c30a707551ba	52c69a50-612c-45f4-8246-0418f7ac6212	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:06.304	gm
09ced5db-3999-4496-89b4-179f0ed03221	52c69a50-612c-45f4-8246-0418f7ac6212	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:06.305	gm
9c94441b-bd72-4d9d-afd1-1255bdb46afa	86d696c7-5a69-4892-a335-3a0203df6401	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:06.33	kg
2adbdf06-8c30-4606-8cb7-2e310e13bbc3	86d696c7-5a69-4892-a335-3a0203df6401	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	60.00	60.00	500	120.00	1000	60.00	2025-09-27 15:42:06.331	gm
afa8beee-16f2-435c-95eb-ea7793a67dd2	86d696c7-5a69-4892-a335-3a0203df6401	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.332	gm
c319fb49-21fe-43d3-b692-afc97eeeb432	86d696c7-5a69-4892-a335-3a0203df6401	738a0900-9798-424c-a3f6-04a98bcf3848	2	70.00	0.14	2	70.00	1000	0.14	2025-09-27 15:42:06.333	kg
2982c67a-9366-434a-bbf1-c10fc9692e36	86d696c7-5a69-4892-a335-3a0203df6401	7a1f2b62-4324-47bb-9af9-b6edbf6169d6	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:06.334	gm
34ba2a29-5fc0-49a1-877f-fb6b41e0d1e1	86d696c7-5a69-4892-a335-3a0203df6401	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:06.336	gm
c67b2709-5c5b-4c52-a8d4-eafc29ee6c34	86d696c7-5a69-4892-a335-3a0203df6401	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:06.337	gm
feccdb6f-6904-4278-bd06-3095c8465e91	86d696c7-5a69-4892-a335-3a0203df6401	cba9a138-b913-47df-b1fa-61663c7603b0	1	80.00	0.08	1	80.00	1000	0.08	2025-09-27 15:42:06.338	kg
946a7341-78bc-4c00-be3c-53cb9c2dc480	61f01f8c-1dda-4fb1-b51b-131a4613f856	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	35.00	35.00	250	140.00	1000	35.00	2025-09-27 15:42:12.9	gm
d10478a3-38b2-40c3-9ac1-6d25c9e66e1e	7ba206cd-a4a8-4c36-9019-512445c09e50	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.92	gm
8c85b5e9-7fe0-4341-bd4d-5d0e3b890bc0	7ba206cd-a4a8-4c36-9019-512445c09e50	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:12.922	gm
32782d4d-a1c0-4e1c-965a-f659d60023a1	7ba206cd-a4a8-4c36-9019-512445c09e50	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	35.00	35.00	250	140.00	1000	35.00	2025-09-27 15:42:12.924	gm
713a7ea9-9ff1-4e52-b75c-bfa9f0a7824c	7ba206cd-a4a8-4c36-9019-512445c09e50	682089ef-89e9-4860-bfe0-e286ada294dd	1	30.00	30.00	1	30.00	1	30.00	2025-09-27 15:42:12.925	pc
a1c26f91-540e-4733-924d-c9dd3e790383	7ba206cd-a4a8-4c36-9019-512445c09e50	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-09-27 15:42:12.926	pc
51d28a62-6971-4ccf-9299-bb1fc4b9f3c4	7ba206cd-a4a8-4c36-9019-512445c09e50	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.927	gm
5bbc332a-83c4-44c2-a227-a8b5bd6743ea	7ba206cd-a4a8-4c36-9019-512445c09e50	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:12.927	pc
aa9ffbf4-e18c-476d-953f-a7a1f5fd862b	7ba206cd-a4a8-4c36-9019-512445c09e50	97d66b60-b3da-41f0-a6b0-305cbb2fb464	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:12.928	gm
797d61bc-62d1-4ed8-84a7-041b44a1592a	1393b251-cf29-400c-b894-80196ef1e9c4	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.95	gm
64663a33-8ce6-451b-8f28-22dd9b42a78c	1393b251-cf29-400c-b894-80196ef1e9c4	81ee7d10-3404-4ae2-b740-8acf875e3ba2	500	60.00	60.00	500	120.00	1000	60.00	2025-09-27 15:42:12.953	gm
75c4eaf0-b3f8-4487-a8f2-2fcb2ff2df69	1393b251-cf29-400c-b894-80196ef1e9c4	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:12.954	gm
544aeccb-9bb8-4515-aebe-8d4a9e39b9e2	1393b251-cf29-400c-b894-80196ef1e9c4	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.955	gm
703fc8f2-5a7c-4bfc-a3e6-98091b220830	1393b251-cf29-400c-b894-80196ef1e9c4	cda76cb0-5ecf-4cfe-a790-64c267cf5b09	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:12.956	gm
328851d8-b976-4ba7-b0a7-abfeefd24ed2	1393b251-cf29-400c-b894-80196ef1e9c4	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:12.956	gm
84592e78-8164-4bc9-8312-9ce59ded1c47	1393b251-cf29-400c-b894-80196ef1e9c4	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:12.957	gm
b5b2d19d-b588-4f38-90c7-f7894e59d847	1393b251-cf29-400c-b894-80196ef1e9c4	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.958	gm
fefc7796-dac8-4d87-9873-86dd72b65504	1393b251-cf29-400c-b894-80196ef1e9c4	bd71ec96-c096-496b-9993-b560661cbb48	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.959	gm
35d01ad8-1706-4ba4-9f0f-b28c822183cc	1393b251-cf29-400c-b894-80196ef1e9c4	c1c3bf43-b581-408e-9317-57d81fa7ae00	500	60.00	60.00	500	120.00	1000	60.00	2025-09-27 15:42:12.96	gm
69593cc2-976c-4d81-8022-18dac7931a5c	1393b251-cf29-400c-b894-80196ef1e9c4	738a0900-9798-424c-a3f6-04a98bcf3848	500	15.00	15.00	500	30.00	1000	15.00	2025-09-27 15:42:12.96	gm
3d71e6a4-c9cd-4e9d-b3e8-384654e93eb3	1393b251-cf29-400c-b894-80196ef1e9c4	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:12.961	gm
50ed58dd-9ec1-4980-a9ca-6108ef93611e	88ac84d9-fadc-42b0-9c01-581ea7fdc559	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:12.98	gm
dc6266ad-b57e-47a3-bef2-5302edc41401	88ac84d9-fadc-42b0-9c01-581ea7fdc559	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.982	gm
ef05dbe9-95db-4e66-a564-97a34f7b1c4c	88ac84d9-fadc-42b0-9c01-581ea7fdc559	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:12.983	gm
b25ee0a8-fc1b-463d-8a4e-1b252efa003a	88ac84d9-fadc-42b0-9c01-581ea7fdc559	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:12.984	gm
c74fa4bb-2ff7-4b36-ae3f-452a88f5b2e5	88ac84d9-fadc-42b0-9c01-581ea7fdc559	682089ef-89e9-4860-bfe0-e286ada294dd	1	30.00	30.00	1	30.00	1	30.00	2025-09-27 15:42:12.985	pc
89f6c3b2-aed7-4a17-bfae-d475f1227d0d	39e8663f-3e2d-4b79-843e-4d96c71ea983	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:13.005	gm
f0f0bff6-ad4c-42c9-86ef-89066fb0a573	39e8663f-3e2d-4b79-843e-4d96c71ea983	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:13.007	gm
b23c0f67-36ff-475a-bf45-f81e6ad00f92	39e8663f-3e2d-4b79-843e-4d96c71ea983	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:13.009	kg
b7a3dec4-4c5c-48c8-86b1-6388b3ae5ce3	39e8663f-3e2d-4b79-843e-4d96c71ea983	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:13.009	gm
236ed5f0-ef0a-4908-bc91-30776a4b5b1c	39e8663f-3e2d-4b79-843e-4d96c71ea983	0653ab92-5171-418b-89d2-9e6b60482bbb	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:13.01	gm
7c251eff-e2a0-4fd9-9d85-a8d27676e7c9	39e8663f-3e2d-4b79-843e-4d96c71ea983	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:13.01	gm
1c3737af-26f6-4866-97ac-c59a95bcf524	39e8663f-3e2d-4b79-843e-4d96c71ea983	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:13.011	gm
fbbd19c8-31c9-406f-8c49-766d7bd2218b	39e8663f-3e2d-4b79-843e-4d96c71ea983	43f5ae1c-ecad-4e22-9825-712dde5d647e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:13.012	gm
affb8760-2828-429c-98c6-187fc3fd3ced	39e8663f-3e2d-4b79-843e-4d96c71ea983	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:13.012	gm
edf237b5-78b9-4da9-9095-9d082aa21e0c	39e8663f-3e2d-4b79-843e-4d96c71ea983	7fded13b-5795-4f23-a8ba-c1c830755b18	200	12.00	12.00	200	60.00	1000	12.00	2025-09-27 15:42:13.012	gm
1e63d961-7895-4804-983c-b6da6421d409	f48f778c-a10a-4f9f-8d9d-5b0def8d1af2	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:13.034	gm
ca0ff097-a41c-4157-8758-e0cb423fb64d	f48f778c-a10a-4f9f-8d9d-5b0def8d1af2	feb933e8-b9cb-4046-978c-f8619c693eb5	750	90.00	90.00	750	120.00	1000	90.00	2025-09-27 15:42:13.036	gm
b4894f29-95e4-4f89-bbc3-c15b244b80c6	f48f778c-a10a-4f9f-8d9d-5b0def8d1af2	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:13.037	gm
d10fa1c0-f0dd-4cd2-824b-62c8f175c8bd	f48f778c-a10a-4f9f-8d9d-5b0def8d1af2	2eae0636-1fa4-4d47-855f-306125787b1e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:13.038	gm
1c824337-c547-4d92-9a7d-3e59c2445aad	f48f778c-a10a-4f9f-8d9d-5b0def8d1af2	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:13.039	gm
a9801d53-4e83-4d4c-b506-98530cf2d557	f48f778c-a10a-4f9f-8d9d-5b0def8d1af2	de8e800e-c915-4d26-9ff5-94701f51222d	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:13.039	gm
c87367c8-7956-413c-b9b6-40bdccdf0b85	f48f778c-a10a-4f9f-8d9d-5b0def8d1af2	97d66b60-b3da-41f0-a6b0-305cbb2fb464	500	35.00	35.00	500	70.00	1000	35.00	2025-09-27 15:42:13.04	gm
d466cb96-4b24-4b9b-be7c-faa8e009d3a0	f48f778c-a10a-4f9f-8d9d-5b0def8d1af2	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:13.04	gm
afb7e656-315b-4372-8ca1-a2fd68254a66	f48f778c-a10a-4f9f-8d9d-5b0def8d1af2	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:13.04	gm
999c858d-7060-4d82-8112-a03f7a525dc3	f48f778c-a10a-4f9f-8d9d-5b0def8d1af2	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	750	45.00	45.00	750	60.00	1000	45.00	2025-09-27 15:42:13.041	gm
c4ac52aa-a272-4f5b-93ef-215089a9a102	f48f778c-a10a-4f9f-8d9d-5b0def8d1af2	371c3ff4-639a-46a2-8103-95906e93fb5e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:13.041	gm
1dcce79f-afad-4429-8e21-0c9e55446bed	6d86e17a-d0f3-4e6e-a90c-b2448215fbd9	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:13.061	gm
a2a82a84-99f9-4ab6-bae7-0e42f0af88b3	6d86e17a-d0f3-4e6e-a90c-b2448215fbd9	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:13.063	kg
23a9571e-6357-459c-a5da-10ba6c76f6cb	6d86e17a-d0f3-4e6e-a90c-b2448215fbd9	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:13.064	gm
21763acc-3f76-4483-a774-9abab43623da	a612b63e-dbb5-42a7-9da3-6f78984efc85	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:13.084	gm
c21a24cb-e9e7-43b8-8338-861399e2b659	a612b63e-dbb5-42a7-9da3-6f78984efc85	81ee7d10-3404-4ae2-b740-8acf875e3ba2	350	42.00	42.00	350	120.00	1000	42.00	2025-09-27 15:42:13.086	gm
91be15fe-8011-4620-af8a-df76b115ff0a	a612b63e-dbb5-42a7-9da3-6f78984efc85	682089ef-89e9-4860-bfe0-e286ada294dd	1	30.00	30.00	1	30.00	1	30.00	2025-09-27 15:42:13.087	pc
a196f9b4-c581-4e49-b732-01290829cdbb	a612b63e-dbb5-42a7-9da3-6f78984efc85	7687b526-7d4f-40e5-b274-c66cca337009	1	50.00	50.00	1	50.00	1	50.00	2025-09-27 15:42:13.088	pc
1638cf1d-50b2-4119-abc2-9ad6958c197a	a612b63e-dbb5-42a7-9da3-6f78984efc85	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:13.088	gm
0850be87-cbcc-4d09-8de4-5f0c4b8268fb	a612b63e-dbb5-42a7-9da3-6f78984efc85	738a0900-9798-424c-a3f6-04a98bcf3848	1	30.00	0.03	1	30.00	1000	0.03	2025-09-27 15:42:13.089	kg
88980225-2ad2-44e9-b5c6-21c0c22d2146	a612b63e-dbb5-42a7-9da3-6f78984efc85	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:13.089	gm
286556a7-a18d-4050-b052-e90fe02b6d40	a612b63e-dbb5-42a7-9da3-6f78984efc85	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:13.09	gm
724a834a-85f9-4d80-a744-e7f801d68961	fbda3c25-a49a-46fe-b185-a7f48abd2da3	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:13.108	gm
467eb389-b636-4a9a-b68c-f83a2c25a20c	fbda3c25-a49a-46fe-b185-a7f48abd2da3	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:13.111	gm
a9a83748-9b73-421c-8fd5-d683f90f9b2b	fbda3c25-a49a-46fe-b185-a7f48abd2da3	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	250	38.00	38.00	250	152.00	1000	38.00	2025-09-27 15:42:13.112	gm
df1d000b-febf-42c5-bfbc-f2f546fcdbe1	fbda3c25-a49a-46fe-b185-a7f48abd2da3	97d66b60-b3da-41f0-a6b0-305cbb2fb464	250	18.00	18.00	250	72.00	1000	18.00	2025-09-27 15:42:13.113	gm
26916b78-6f89-48ac-bef3-195764deca20	fbda3c25-a49a-46fe-b185-a7f48abd2da3	43f5ae1c-ecad-4e22-9825-712dde5d647e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:13.113	gm
faca982b-1440-4389-9293-43a07c0f6443	fbda3c25-a49a-46fe-b185-a7f48abd2da3	c1c3bf43-b581-408e-9317-57d81fa7ae00	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:13.114	gm
f81683bb-06c6-41a4-a4eb-89125879660d	fbda3c25-a49a-46fe-b185-a7f48abd2da3	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:13.115	gm
7cc31f67-4a04-4312-ab95-c815218195b3	fbda3c25-a49a-46fe-b185-a7f48abd2da3	682089ef-89e9-4860-bfe0-e286ada294dd	1	30.00	30.00	1	30.00	1	30.00	2025-09-27 15:42:13.115	pc
95501e48-df94-4f01-8ffa-4c5bfc30cff8	fbda3c25-a49a-46fe-b185-a7f48abd2da3	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:13.116	gm
519772de-b2c5-44c5-9b14-a6dcde3cbbc2	fbda3c25-a49a-46fe-b185-a7f48abd2da3	6c1e3d72-7d97-40bb-97b4-93059631140f	2	30.00	30.00	2	15.00	1	30.00	2025-09-27 15:42:13.116	pc
f4b9e1d0-5cdf-4068-9ff4-f186d68fc981	1219e1f8-56a5-4d19-8775-61b81577c1d5	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:13.136	gm
654f6991-72ca-4307-bd92-9849ba9cbdd3	1219e1f8-56a5-4d19-8775-61b81577c1d5	738a0900-9798-424c-a3f6-04a98bcf3848	2	60.00	0.12	2	60.00	1000	0.12	2025-09-27 15:42:13.138	kg
2ecd4a24-cc9f-4ed2-915e-ae5ca608c86b	1219e1f8-56a5-4d19-8775-61b81577c1d5	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	35.00	35.00	250	140.00	1000	35.00	2025-09-27 15:42:13.139	gm
9cd5671b-8b2a-4dd9-a8a9-7afd4d64b3b6	1219e1f8-56a5-4d19-8775-61b81577c1d5	81ee7d10-3404-4ae2-b740-8acf875e3ba2	250	30.00	30.00	250	120.00	1000	30.00	2025-09-27 15:42:13.14	gm
be56003d-9731-4629-9a0d-adb8eb86c46b	1219e1f8-56a5-4d19-8775-61b81577c1d5	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:13.141	gm
1698c944-2f3e-4e50-964d-f0f7de86eca6	1219e1f8-56a5-4d19-8775-61b81577c1d5	feb933e8-b9cb-4046-978c-f8619c693eb5	500	60.00	60.00	500	120.00	1000	60.00	2025-09-27 15:42:13.141	gm
51d40c7e-9ce3-45b9-aa8c-65667d5576a6	1219e1f8-56a5-4d19-8775-61b81577c1d5	35660cc6-d186-4b87-9c97-3c07bbc5303f	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:13.142	gm
61d798d1-a9a9-41ee-b39b-1f21d66486df	456e2420-5328-4144-9ab1-9d851a6d1510	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:13.16	gm
921df8ee-5f17-4153-a5ac-9ec8f5c2e8da	456e2420-5328-4144-9ab1-9d851a6d1510	738a0900-9798-424c-a3f6-04a98bcf3848	2	60.00	0.12	2	60.00	1000	0.12	2025-09-27 15:42:13.162	kg
06d9ad69-b62b-46f1-b270-48d28f34752f	456e2420-5328-4144-9ab1-9d851a6d1510	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:13.163	gm
fa3cadbb-8fb3-4261-9d88-1df33026a10a	456e2420-5328-4144-9ab1-9d851a6d1510	97d66b60-b3da-41f0-a6b0-305cbb2fb464	700	49.00	49.00	700	70.00	1000	49.00	2025-09-27 15:42:13.164	gm
8658344d-18e4-4d62-b0ec-dac7679aa1ee	456e2420-5328-4144-9ab1-9d851a6d1510	b9dda785-3136-4dbb-8cfd-3da82aff9b1c	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:13.165	gm
82644d7e-0cd3-47f9-bdda-36c21fa61c4e	456e2420-5328-4144-9ab1-9d851a6d1510	682089ef-89e9-4860-bfe0-e286ada294dd	1	30.00	30.00	1	30.00	1	30.00	2025-09-27 15:42:13.166	pc
d6b4e532-25c5-4320-ba5c-ee6cd5c8b48c	456e2420-5328-4144-9ab1-9d851a6d1510	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	300	42.00	42.00	300	140.00	1000	42.00	2025-09-27 15:42:13.166	gm
66b8c717-5492-4525-ae23-0b3685f98ef6	456e2420-5328-4144-9ab1-9d851a6d1510	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:13.167	gm
5e5b1d78-8a4f-49df-ae49-733b2fcf634f	bd08162d-c5a4-4dd1-a37e-c88aeccc6a46	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:13.191	gm
7bcf4bb7-2ab4-4cbe-a79f-4c4cc8b01032	bd08162d-c5a4-4dd1-a37e-c88aeccc6a46	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	500	70.00	70.00	500	140.00	1000	70.00	2025-09-27 15:42:13.192	gm
b2d813cd-f768-460a-8799-3952c5261e2d	bd08162d-c5a4-4dd1-a37e-c88aeccc6a46	682089ef-89e9-4860-bfe0-e286ada294dd	1	30.00	30.00	1	30.00	1	30.00	2025-09-27 15:42:13.193	pc
1a674ac7-3a3b-4eb7-862c-9c83944cdd71	bd08162d-c5a4-4dd1-a37e-c88aeccc6a46	4dd7d0f0-a081-440c-b2d6-1932ab0f505c	500	25.00	25.00	500	50.00	1000	25.00	2025-09-27 15:42:13.194	gm
98c6dc7c-9f9c-46ac-82fa-fac7da608794	bd08162d-c5a4-4dd1-a37e-c88aeccc6a46	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:13.194	gm
4910c429-6bdc-4864-8cf8-a1626f0d22e5	bd08162d-c5a4-4dd1-a37e-c88aeccc6a46	7fded13b-5795-4f23-a8ba-c1c830755b18	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:13.195	gm
ed4b8237-4546-4cdb-bdfc-be560bab9854	bd08162d-c5a4-4dd1-a37e-c88aeccc6a46	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:13.195	gm
d728a0ad-0899-4d3d-b601-3b338cfd29f8	0f99bd7d-0d30-4bc7-afa1-4b1524bdcef1	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:13.221	gm
3022ca1a-2e0c-4ceb-8571-c6e485dc8256	0f99bd7d-0d30-4bc7-afa1-4b1524bdcef1	371c3ff4-639a-46a2-8103-95906e93fb5e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:13.224	gm
91df5b0a-83c2-402d-a4b4-d635231af9d9	0f99bd7d-0d30-4bc7-afa1-4b1524bdcef1	de8e800e-c915-4d26-9ff5-94701f51222d	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:13.225	gm
d40e12ea-ed40-4ddb-88b0-db5cc347e1ae	0f99bd7d-0d30-4bc7-afa1-4b1524bdcef1	6c1e3d72-7d97-40bb-97b4-93059631140f	1	15.00	15.00	1	15.00	1	15.00	2025-09-27 15:42:13.225	pc
bbee7f16-9a79-4cd1-a7d8-703df226c284	0f99bd7d-0d30-4bc7-afa1-4b1524bdcef1	43f5ae1c-ecad-4e22-9825-712dde5d647e	250	25.00	25.00	250	100.00	1000	25.00	2025-09-27 15:42:13.226	gm
29cd9cf8-341f-4c92-80f4-06030f2ce980	0f99bd7d-0d30-4bc7-afa1-4b1524bdcef1	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:13.226	gm
c54e156f-455c-49a4-9e5a-38570b8a5341	0f99bd7d-0d30-4bc7-afa1-4b1524bdcef1	7fded13b-5795-4f23-a8ba-c1c830755b18	250	15.00	15.00	250	60.00	1000	15.00	2025-09-27 15:42:13.227	gm
999820d7-dac0-42f4-b6b8-bf09bdb2c01c	710f6c4c-2900-48bb-925b-34e78c288271	56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:13.245	gm
ad96f6ec-2a4b-4747-90f9-947216ee4c63	710f6c4c-2900-48bb-925b-34e78c288271	b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	250	35.00	35.00	250	140.00	1000	35.00	2025-09-27 15:42:13.246	gm
8e009972-ec73-430a-90bf-fb4f1a19d9f3	710f6c4c-2900-48bb-925b-34e78c288271	bc51aace-2385-4f8e-bcf7-dbae8d782ae5	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:13.247	gm
4c8227a2-d717-488f-a577-4eb80530d6b3	710f6c4c-2900-48bb-925b-34e78c288271	0653ab92-5171-418b-89d2-9e6b60482bbb	500	30.00	30.00	500	60.00	1000	30.00	2025-09-27 15:42:13.247	gm
479c11ac-9cb7-453d-aaa5-84449c6b8d47	710f6c4c-2900-48bb-925b-34e78c288271	7fded13b-5795-4f23-a8ba-c1c830755b18	1	0.00	0.00	1	0.00	1000	0.00	2025-09-27 15:42:13.248	gm
932b77d8-28b7-488d-8ca2-d34227a63940	710f6c4c-2900-48bb-925b-34e78c288271	738a0900-9798-424c-a3f6-04a98bcf3848	2	60.00	0.12	2	60.00	1000	0.12	2025-09-27 15:42:13.248	kg
a991e10e-a027-4f31-b4c5-ecc1f00c9572	710f6c4c-2900-48bb-925b-34e78c288271	fa51fd6b-fab5-4eea-8308-b50acb6e49f1	200	30.00	30.00	200	150.00	1000	30.00	2025-09-27 15:42:13.249	gm
019e28ad-53db-48b2-8308-7495d36d81f9	710f6c4c-2900-48bb-925b-34e78c288271	d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	100	15.00	15.00	100	150.00	1000	15.00	2025-09-27 15:42:13.249	gm
88f0d22e-4b19-446d-a1b6-47712821722a	710f6c4c-2900-48bb-925b-34e78c288271	be7965d2-e7ae-42dd-9731-b1195135005e	500	50.00	50.00	500	100.00	1000	50.00	2025-09-27 15:42:13.249	gm
1c6670ed-4365-49d7-82f7-884783505c16	0a41e8dd-b7c0-47a7-8f72-c5a637c9e1ee	cba9a138-b913-47df-b1fa-61663c7603b0	500	30.00	30.00	500	30.00	500	30.00	2025-09-27 14:40:15.988491	gm
\.


--
-- TOC entry 3506 (class 0 OID 41363)
-- Dependencies: 217
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, "customerId", status, "totalAmount", notes, "createdAt", "updatedAt", "paymentMode", "deliveryDate", discount, "monthlyBillId") FROM stdin;
1d846bd3-6b44-42d1-84af-ae38a9941f0d	91071c17-4d9a-4ba3-9696-b1ed80e85093	delivered	130.00	Society: The Vienza | Flat: C-1002	2025-09-27 15:42:06.134	2025-10-02 13:14:22.278952	cod	2025-09-27	100.00	\N
d9ba2f1d-ff0f-43df-a975-099f8a91987f	a433b5e7-f4d7-4bfc-951e-207a4f4a7b3e	delivered	145.00	Flat: Unknown | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.865	2025-08-25 18:53:56.216	cod	2025-08-03	100.00	\N
76445d34-0cc7-4769-9c1d-c23dfe8fc91e	77688538-8035-4580-8ec1-c565caa1ef17	delivered	100.00	Society: The Vienza | Flat: A-701 -> A-901 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.89	2025-08-25 19:06:19.877	cod	2025-08-06	100.00	\N
65ca599b-fe88-406c-95f3-7cb44ad62d71	3a05a7b5-8b15-4587-8c82-2f8c949b9f50	delivered	40.00	Society: The Vienza | Flat: B-1104 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.913	2025-08-25 19:07:41.02	cod	2025-08-06	0.00	\N
f80e4c90-1bd9-47c1-a3fc-918d7650ffe6	d93386aa-42b0-403a-998b-ac94c410a7fd	delivered	150.00	Society: The Vienza | Flat: A-602 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.941	2025-08-25 18:52:24.678	cod	2025-08-03	100.00	\N
f0568140-ca00-4ade-98a6-9d24aa060786	3a05a7b5-8b15-4587-8c82-2f8c949b9f50	delivered	160.00	Society: The Vienza | Flat: B-1104 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.555	2025-08-25 18:59:02.436	cod	2025-08-03	100.00	\N
29306dc3-06bc-4801-8bea-9cf31cee3e1a	482464d2-3ff6-4d81-ac05-495e9512d0b1	delivered	180.00	Society: The Vienza | Flat: B-103 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.595	2025-08-25 18:59:55.862	cod	2025-08-06	100.00	\N
4d1f4772-d1ca-4a45-a79c-26604707f93d	73a77b18-546f-4295-b1ce-7ca9398f895d	delivered	131.00	Society: The Vienza | Flat: A 101 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.618	2025-08-25 19:00:10.89	cod	2025-08-06	100.00	\N
ec4ca6bb-cdb6-4c32-9330-7ed5e0149589	30a179a7-bafe-4412-8383-0e194cfb6b6a	delivered	125.00	Society: The Vienza | Flat: C-1104 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.644	2025-08-25 18:51:28.953	cod	2025-08-03	100.00	\N
d9530e1b-974d-4b14-bf0a-73e54a76cb24	9296d5c2-7f35-4294-bdb1-508ac8610567	delivered	310.00	Society: Tulshi Heights | Flat: B-601 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.672	2025-08-25 18:53:34.399	cod	2025-08-03	100.00	\N
5ecc55a7-c1d6-4018-a81d-ecf44b3f193b	575d4c3b-9545-4844-bee8-72f143e06588	delivered	100.00	Society: The Vienza | Flat: A-1102 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.714	2025-08-25 18:58:14.686	cod	2025-08-03	100.00	\N
60470190-5afe-475c-a59e-7c218f192b66	9051cac2-d198-410c-9e1a-12ddc09a0281	delivered	40.00	Society: The Vienza | Flat: C-202 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.968	2025-08-25 19:03:22.626	cod	2025-08-06	0.00	\N
92947482-0b78-4431-91f3-d8bc9a280593	aad02ebc-b79a-41da-aa7b-06063b213dcb	delivered	320.00	Society: Other | Flat: Referance From Paras | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.997	2025-08-25 19:07:55.439	cod	2025-08-06	320.00	\N
b3176d4f-c79e-40e8-bb95-63dd49931812	1288b864-f877-43de-bb38-a9fdf25139ba	delivered	110.00	Society: The Vienza | Flat: A-603 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.74	2025-08-25 18:59:17.036	cod	2025-08-06	30.00	\N
5890dfd7-cec5-4020-b58b-c23b10e8d103	785142de-c2aa-43bb-ab19-851d6fdbf58a	delivered	140.00	Society: The Vienza | Flat: B-1304 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.76	2025-08-25 19:02:56.569	cod	2025-08-06	100.00	\N
29e4904b-0d01-4ba1-9d39-f8309c6330e3	b6ed41d6-3855-4be9-8556-509649f98ea3	delivered	145.00	Society: The Vienza | Flat: C-503 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.785	2025-08-25 18:51:47.493	cod	2025-08-03	100.00	\N
5dc7998c-18ab-4adc-9d05-3e3b33fa6b39	b3833c23-20c7-4f01-86b6-cfbe076177c8	delivered	180.00	Society: Swranim Stown | Flat: C 704 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.815	2025-08-25 19:06:55.522	cod	2025-08-06	100.00	\N
253d402a-ab33-444e-a703-7487a45826e1	59fb23ae-d1db-4848-81c3-dd81c18b9c03	delivered	100.00	Society: The Vienza | Flat: C 601 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:05.843	2025-08-25 19:07:25.453	cod	2025-08-06	100.00	\N
34b3bd66-4972-4549-9122-dca80be6e778	31c134a9-aa1c-4841-bab3-dc6b4f839b85	delivered	180.00	Society: Swranim Stown | Flat: C-702 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.022	2025-09-14 19:51:17.587	cod	2025-08-03	100.00	\N
769c9d04-46b7-4dac-a517-6ebd522131ca	852b04f2-6161-4bc8-9c0e-25dfb21843ee	delivered	80.00	Society: The Vienza | Flat: A 902 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.049	2025-08-25 19:00:46.265	cod	2025-08-06	0.00	\N
a77f8411-7105-46ae-b484-9b5976cdbf38	b10d3155-4939-4d12-b63b-e6c7f099b2c8	delivered	75.00	Society: The Vienza | Flat: A 704 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.075	2025-08-25 19:02:10.881	cod	2025-08-06	0.00	\N
6b319518-cd3d-42b8-b5b3-9e74548c4c6e	508d35ee-9499-4a36-a86e-87aea14a19ee	delivered	250.00	Society: The Vienza | Flat: A-604 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.101	2025-08-25 18:51:09.499	cod	2025-08-03	100.00	\N
877a14c4-56b4-4c73-80b6-f07ee3be6487	7ff6ecf3-3c66-4b1b-a46d-751f1bf1ca03	delivered	133.00	Flat: A-1004 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.241	2025-08-25 18:58:48.434	cod	2025-08-03	100.00	\N
52c69a50-612c-45f4-8246-0418f7ac6212	bbf2b0ae-1138-4c82-a9e8-5de175783faf	delivered	85.00	Society: The Vienza | Flat: A-403 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.28	2025-08-25 19:00:26.689	cod	2025-08-06	0.00	\N
86d696c7-5a69-4892-a335-3a0203df6401	42db859d-2b6d-413a-995c-ecfcc592efec	delivered	415.00	Society: The Vienza | Flat: C-1001 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.306	2025-08-25 19:01:04.753	cod	2025-08-06	100.00	\N
29beac97-bc73-42f7-87fb-a4d05bff9a4b	45a7f3ee-7708-4f9c-8614-abd65f86fd2f	delivered	243.00	Society: The Vienza | Flat: C 903 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.338	2025-08-25 19:03:38.646	cod	2025-08-06	100.00	\N
cfc74563-b33a-4062-8dc6-6ddd3555ff58	11dfff00-3c8b-416f-9a4a-3b7a1480083d	delivered	115.00	Society: The Vienza | Flat: A -802 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.367	2025-08-25 19:06:35.592	cod	2025-08-06	100.00	\N
e88cb5b9-2d14-4bde-8dad-2f9131557e94	1288b864-f877-43de-bb38-a9fdf25139ba	delivered	230.00	Society: The Vienza | Flat: A-603 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.39	2025-09-14 19:56:59.614	cod	2025-08-03	100.00	\N
60b233a9-819b-40a7-bd41-d7db29c03a7e	ead2fb47-aa53-4a26-b71b-7ddcdd78a5fa	delivered	75.00	Society: The Vienza | Flat: A-301 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.42	2025-08-25 18:58:32.101	cod	2025-08-03	100.00	\N
754878fe-b1e0-453f-8acb-31db64755bdd	0dfba9c7-26be-434a-8730-81bbba44d911	delivered	130.00	Society: The Vienza | Flat: B-902 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.458	2025-08-25 19:01:38.076	cod	2025-08-06	100.00	\N
5f6b8149-6789-4539-9224-d584c79be819	e3ed9081-7304-47e4-a96f-1269fc73810e	delivered	75.00	Society: The Vienza | Flat: B 802 | Wallet Used: ₹75 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.482	2025-08-25 19:03:55.255	wallet	2025-08-06	0.00	\N
b06acac3-d70e-4372-a269-3a532531faed	4c20c147-b762-4842-a089-8cc3aed679eb	delivered	180.00	Society: The Vienza | Flat: C1101 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.513	2025-08-25 19:05:49.387	cod	2025-08-06	100.00	\N
c12fbe1e-1c7c-41cb-972b-364961ec76f4	e3ed9081-7304-47e4-a96f-1269fc73810e	delivered	60.00	Society: The Vienza | Flat: B 802 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.541	2025-08-25 18:53:14.832	cod	2025-08-03	100.00	\N
90b517a2-d1ad-4a92-b4f8-0671622171c3	2ab70cad-148a-4518-907e-816134b23206	delivered	100.00	Society: The Vienza | Flat: A-401 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.564	2025-08-25 19:05:15.098	cod	2025-08-06	100.00	\N
e75e6bdd-887c-49c3-9e95-de4ec13064f4	a433b5e7-f4d7-4bfc-951e-207a4f4a7b3e	delivered	135.00	Society: The Vienza | Flat: Unknown | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.599	2025-08-25 19:06:04.501	cod	2025-08-06	100.00	\N
c25c79f1-9436-430c-8c12-8449e3cbfecf	d14804c1-315d-437a-9ae6-69f663268eef	delivered	308.00	Society: The Vienza | Flat: A-202 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.624	2025-08-25 18:57:00.708	cod	2025-08-03	100.00	\N
4926c9a6-79e8-4669-b5eb-94189af3c475	d4c3d6e2-c77a-4587-8008-3ba718606f6e	delivered	110.00	Society: Other | Flat: Reference from paras | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.654	2025-08-25 18:57:39.732	cod	2025-08-03	110.00	\N
5317f8bf-b7eb-4113-a55a-fc0cd194f740	30a179a7-bafe-4412-8383-0e194cfb6b6a	delivered	125.00	\N	2025-09-28 03:47:16.477037	2025-10-02 13:14:22.238246	cod	2025-09-28	0.00	\N
0a41e8dd-b7c0-47a7-8f72-c5a637c9e1ee	d3a63b74-30b5-4fa9-96dd-cc724fa26b54	delivered	30.00	\N	2025-09-27 14:40:15.988491	2025-10-02 13:14:22.238136	cod	2025-09-28	0.00	\N
b6fa88b0-17ed-4ea7-be00-ad671d4a80ce	e6027508-add9-4b40-9876-2e81be9e230b	delivered	355.00	\N	2025-09-27 14:48:31.988504	2025-10-02 13:14:22.240961	cod	2025-09-28	0.00	\N
9c19c94a-d2dd-4496-a410-4941d518e4e7	e88595e2-5ee9-462d-b094-1a64c9379e04	delivered	57.50	\N	2025-09-27 14:33:44.612853	2025-10-02 13:14:22.267922	cod	2025-09-28	0.00	\N
0777ffa9-5e77-4dfd-8e92-45e27bfd0c95	508d35ee-9499-4a36-a86e-87aea14a19ee	delivered	360.00	\N	2025-09-27 14:34:48.845906	2025-10-02 13:14:22.274357	cod	2025-09-28	0.00	\N
3c1a6be1-0d50-4a65-a91f-66a55da53abb	11dfff00-3c8b-416f-9a4a-3b7a1480083d	delivered	20.00	Society: The Vienza | Flat: A802	2025-09-27 15:42:08.511	2025-10-02 13:14:22.2838	cod	2025-09-27	6.00	\N
abeb90cc-8a5b-403f-a05c-0ca9febf6859	b572d8f9-3a0e-4b04-aaa1-fd0ed946244e	delivered	150.00	\N	2025-10-02 14:12:53.170211	2025-10-05 04:57:24.825846	cod	2025-10-03	0.00	\N
0f09c61f-e9f8-4cbd-a159-ee12a7c0843d	52e679f8-cd31-41f4-a453-8c709b9e525f	delivered	155.00	\N	2025-10-03 15:01:11.196945	2025-10-05 04:57:24.842597	cod	2025-10-03	0.00	\N
b8787c73-71e4-4e24-ba89-e6b87597d140	f9e98b36-4c63-4f48-8842-f2650e599429	delivered	342.50	\N	2025-10-02 13:57:05.648449	2025-10-05 04:57:24.846802	cod	2025-10-03	0.00	\N
5d4312e3-f06a-4eeb-8146-7f5c735ad052	e3ed9081-7304-47e4-a96f-1269fc73810e	delivered	55.00	\N	2025-10-02 14:38:25.144647	2025-10-05 04:57:24.862162	wallet	2025-10-03	0.00	\N
8db9e2e9-e65d-4fb0-bd96-ad5c1f7a9ec7	b10d3155-4939-4d12-b63b-e6c7f099b2c8	delivered	190.00	\N	2025-10-02 14:18:36.109418	2025-10-05 04:57:24.86638	cod	2025-10-03	0.00	\N
657e1132-73ba-461f-8d4b-e5d8a9631958	91071c17-4d9a-4ba3-9696-b1ed80e85093	delivered	77.50	\N	2025-10-02 14:24:41.384846	2025-10-05 04:57:24.871236	cod	2025-10-03	0.00	\N
fcab4f7f-da79-4f16-b74b-b7196278b926	57953160-7717-404b-a36f-545877ff4064	delivered	130.00	\N	2025-10-02 13:59:01.530032	2025-10-05 04:57:29.726161	cod	2025-10-03	0.00	\N
686f32f0-994e-4f20-9ad9-2be6991eadab	82efca2c-eda9-4458-8eb9-a5746c0380f0	delivered	470.00	\N	2025-10-07 14:42:08.291819	2025-10-11 15:10:43.15766	cod	2025-10-08	0.00	\N
7f9869f0-3b3d-4c82-8296-4d1e1b7b0487	b1ff0014-3714-4fb6-a6f2-e8d421667b93	delivered	140.00	\N	2025-10-07 13:18:30.118358	2025-10-11 15:10:43.15815	cod	2025-10-08	0.00	\N
0f331604-979c-44f9-a509-9df373341c18	83ba0368-cde5-4cd5-960b-89283d191b77	delivered	125.00	\N	2025-10-07 13:21:29.364265	2025-10-11 15:10:43.158737	cod	2025-10-08	0.00	\N
af5767d4-87a0-4a9b-a005-9e0e5812c813	7ff6ecf3-3c66-4b1b-a46d-751f1bf1ca03	delivered	153.50	\N	2025-10-07 15:10:24.164354	2025-10-11 15:10:43.168937	wallet	2025-10-08	0.00	\N
12ae5df3-5f5e-4feb-9a6b-067882c959d7	30a179a7-bafe-4412-8383-0e194cfb6b6a	delivered	291.50	\N	2025-10-07 14:45:53.88869	2025-10-11 15:10:43.19414	cod	2025-10-08	0.00	\N
f3bfb3cf-861e-404b-b4a3-4d2fa34d5e8f	52e679f8-cd31-41f4-a453-8c709b9e525f	delivered	80.00	\N	2025-10-07 15:16:47.230859	2025-10-11 15:10:48.209828	cod	2025-10-08	0.00	\N
efad2c03-3926-437b-bf3c-46d61353d458	b10d3155-4939-4d12-b63b-e6c7f099b2c8	delivered	292.50	\N	2025-10-07 14:35:15.16925	2025-10-11 15:10:48.210219	cod	2025-10-08	75.00	\N
d6579e1e-da1d-42e8-8588-9aa65956ab4b	82efca2c-eda9-4458-8eb9-a5746c0380f0	pending	380.00	\N	2025-10-11 15:21:57.73137	2025-10-11 15:21:57.73137	cod	2025-10-12	0.00	\N
96787227-e251-43c0-b3c3-6caf4a4bd449	83ba0368-cde5-4cd5-960b-89283d191b77	pending	380.00	add nana marcha	2025-10-11 15:26:22.44077	2025-10-11 15:26:22.44077	cod	2025-10-12	0.00	\N
c3c2171f-a12d-4eb2-b573-78790cacc8dd	c11e2dc5-754b-45af-834f-3f037c91ab87	pending	350.00	\N	2025-10-11 15:32:15.103501	2025-10-11 15:32:15.103501	cod	2025-10-12	0.00	\N
feab869d-5299-4c93-ba3d-cbb76c72f72f	4c20c147-b762-4842-a089-8cc3aed679eb	pending	145.00	\N	2025-10-11 15:35:43.581789	2025-10-11 15:35:43.581789	cod	2025-10-12	0.00	\N
8b8d8f33-c68a-423b-9d94-aeef3ec68603	165c87f4-6ea0-4d4f-b231-b07ebcc299b0	pending	325.00	\N	2025-10-11 16:14:48.374289	2025-10-11 16:14:48.374289	cod	2025-10-12	0.00	\N
493bbffe-b188-4d1b-8870-8cc87baceef2	b10d3155-4939-4d12-b63b-e6c7f099b2c8	delivered	200.00	Society: The Vienza | Flat: A 704	2025-09-27 15:42:12.807	2025-09-27 10:14:08.46053	cod	2025-09-24	0.00	\N
570ceb3c-dec0-4bff-9a8d-2796924bd37d	e88595e2-5ee9-462d-b094-1a64c9379e04	pending	162.50	\N	2025-10-11 15:22:24.60996	2025-10-11 15:22:24.60996	monthly	2025-10-12	0.00	\N
59a15149-4d06-4a0a-969b-30486ac6539e	9296d5c2-7f35-4294-bdb1-508ac8610567	delivered	224.50	\N	2025-09-27 14:49:55.565012	2025-10-02 13:14:22.25803	cod	2025-09-28	0.00	\N
33e1d817-f589-4d5e-b891-7fde45a83393	91071c17-4d9a-4ba3-9696-b1ed80e85093	delivered	300.00	\N	2025-09-27 14:41:20.319942	2025-10-02 13:14:22.260297	cod	2025-09-28	0.00	\N
ef339ec2-29a4-4846-b6da-67e7f4e71ef2	bab4eb84-5c93-41c2-ba24-9de74fa5bfeb	delivered	117.50	\N	2025-09-27 14:27:50.661612	2025-10-02 13:14:22.270102	cod	2025-09-28	0.00	\N
a6f2fd9b-5871-4f5a-8ef2-f34f7414a669	d93386aa-42b0-403a-998b-ac94c410a7fd	delivered	194.50	\N	2025-09-27 14:36:54.581094	2025-10-02 13:14:22.274751	monthly	2025-09-28	0.00	6d7d0076-147e-4d21-a567-88ab74c31db2
b337d580-8aad-4c75-8282-5e2413e3fa17	82efca2c-eda9-4458-8eb9-a5746c0380f0	delivered	300.00	\N	2025-10-02 14:00:23.006472	2025-10-05 04:57:24.835218	cod	2025-10-03	0.00	\N
055b64cb-b349-4fa8-b0e4-70e725e8504f	3fc57ae6-1c69-4773-8e99-3277b4ccd098	delivered	167.50	\N	2025-10-02 13:48:04.384573	2025-10-05 04:57:24.844637	cod	2025-10-03	0.00	\N
38cfbe43-c600-4024-a985-5416385e6be8	d93386aa-42b0-403a-998b-ac94c410a7fd	delivered	262.50	\N	2025-10-02 14:09:43.471971	2025-10-05 04:57:24.847336	monthly	2025-10-03	0.00	\N
b209c129-4546-4f8b-8afd-2396a4531df1	11dfff00-3c8b-416f-9a4a-3b7a1480083d	delivered	142.50	\N	2025-10-02 14:27:44.106947	2025-10-05 04:57:24.855335	monthly	2025-10-03	0.00	\N
c6b6ed68-73a9-4a05-b85a-7767eafd1ac9	c957abc0-fd67-4ad9-b9f4-de8a5ad4c6a1	delivered	635.50	\N	2025-10-02 14:15:27.230439	2025-10-05 04:57:24.863935	cod	2025-10-03	0.00	\N
558f7473-9ab1-41fa-8dc6-ddc0a8d28a6c	98a27a1c-4f43-45f0-b6d8-2c5165327730	delivered	115.00	\N	2025-10-02 14:19:44.483787	2025-10-05 04:57:24.870902	cod	2025-10-03	0.00	\N
898474c4-a8dc-49e8-9cca-cbe06abc9a24	c957abc0-fd67-4ad9-b9f4-de8a5ad4c6a1	delivered	720.00	\N	2025-10-07 14:57:46.559535	2025-10-11 15:10:43.158438	cod	2025-10-08	0.00	\N
b90fe439-daee-42b1-8af7-4992dd3928eb	31c134a9-aa1c-4841-bab3-dc6b4f839b85	delivered	224.50	\N	2025-10-07 15:12:39.620179	2025-10-11 15:10:43.175186	cod	2025-10-08	0.00	\N
67b89474-55e0-47a8-80d4-edc27c89248d	508d35ee-9499-4a36-a86e-87aea14a19ee	delivered	110.00	\N	2025-10-07 13:22:33.721763	2025-10-11 15:10:43.180455	cod	2025-10-08	0.00	\N
45e8c8e7-9202-4401-9e27-05d21c10c092	42db859d-2b6d-413a-995c-ecfcc592efec	delivered	165.00	\N	2025-10-07 14:36:26.51782	2025-10-11 15:10:43.181998	cod	2025-10-08	0.00	\N
d440d474-9a52-42fa-a5a3-a59f2ba46b43	11dfff00-3c8b-416f-9a4a-3b7a1480083d	delivered	25.00	\N	2025-10-07 15:18:11.241398	2025-10-11 15:10:43.183131	monthly	2025-10-08	0.00	\N
71399bb7-ff2c-4717-9720-485ed4a475fd	98a27a1c-4f43-45f0-b6d8-2c5165327730	delivered	119.00	\N	2025-10-07 14:43:30.840137	2025-10-11 15:10:43.186784	cod	2025-10-08	0.00	\N
7b130de8-aff2-4c38-bf13-08a51e612847	57953160-7717-404b-a36f-545877ff4064	delivered	207.50	\N	2025-10-07 13:19:52.44787	2025-10-11 15:10:43.19468	cod	2025-10-08	0.00	\N
a39137f2-f513-47b0-bbe6-07ac20496275	d93386aa-42b0-403a-998b-ac94c410a7fd	delivered	210.00	\N	2025-10-07 14:49:23.956872	2025-10-11 15:10:43.195091	monthly	2025-10-08	0.00	\N
66c3f6e3-dde1-46ea-9c1a-f9ac4ef32f1a	785142de-c2aa-43bb-ab19-851d6fdbf58a	pending	75.00	\N	2025-10-11 15:27:13.095189	2025-10-11 15:27:13.095189	cod	2025-10-12	0.00	\N
3ecbf90c-f02e-4698-9c4b-807886106935	e3ed9081-7304-47e4-a96f-1269fc73810e	pending	80.00	\N	2025-10-11 15:33:00.68198	2025-10-11 15:33:00.68198	wallet	2025-10-12	0.00	\N
b94337f0-00aa-4b3a-915d-2102ab86c043	bbf2b0ae-1138-4c82-a9e8-5de175783faf	pending	65.00	\N	2025-10-11 16:15:20.994706	2025-10-11 16:15:20.994706	cod	2025-10-12	0.00	\N
45254c6c-67ab-426c-9e6c-266a55b2be1b	1288b864-f877-43de-bb38-a9fdf25139ba	delivered	619.00	Society: The Vienza | Flat: A-603	2025-09-27 15:42:11.71	2025-09-27 10:14:25.884238	cod	2025-09-18	25.00	\N
db9de674-ca7c-4c73-bdfb-4016fedf1ee2	45a7f3ee-7708-4f9c-8614-abd65f86fd2f	pending	140.00	half fulavar	2025-10-11 15:28:27.60014	2025-10-11 15:28:27.60014	cod	2025-10-12	40.00	\N
39e8663f-3e2d-4b79-843e-4d96c71ea983	d93386aa-42b0-403a-998b-ac94c410a7fd	delivered	257.00	Society: The Vienza | Flat: A-602	2025-09-27 15:42:12.985	2025-09-27 16:24:19.707007	monthly	2025-09-24	0.00	6d7d0076-147e-4d21-a567-88ab74c31db2
6e3b41ba-c95f-4af3-8ae9-d4931cd5bc76	e3ed9081-7304-47e4-a96f-1269fc73810e	delivered	95.00	\N	2025-09-27 14:43:20.530997	2025-10-02 13:14:22.238461	wallet	2025-09-28	0.00	\N
0007337b-b2a5-4070-ab08-e3c30cfbaf1c	7ff6ecf3-3c66-4b1b-a46d-751f1bf1ca03	delivered	215.00	\N	2025-09-27 14:37:27.419943	2025-10-02 13:14:22.259821	cod	2025-09-28	0.00	\N
a7ccb826-10b8-405c-92b5-58137f852971	b10d3155-4939-4d12-b63b-e6c7f099b2c8	delivered	205.00	\N	2025-09-27 14:30:05.635264	2025-10-02 13:14:22.260765	cod	2025-09-28	0.00	\N
7582e03e-86aa-4fc9-a8a4-ef63a41d6b91	508d35ee-9499-4a36-a86e-87aea14a19ee	pending	170.00	\N	2025-10-11 16:13:45.254564	2025-10-11 16:13:45.254564	cod	2025-10-12	0.00	\N
8fa30de7-fd27-490d-880a-ff8c55c8d31c	d5429c6e-5172-48ff-b24a-dd4a0896b9e3	pending	115.00	\N	2025-10-11 16:16:39.330183	2025-10-11 16:16:39.330183	cod	2025-10-12	0.00	\N
8fc63278-d986-4bfd-a34c-55556c138522	11dfff00-3c8b-416f-9a4a-3b7a1480083d	pending	385.00	\N	2025-10-11 15:34:41.319505	2025-10-11 16:34:50.382114	monthly	2025-10-12	0.00	\N
645a371c-e674-4c42-9548-dd93a55ae35b	83ba0368-cde5-4cd5-960b-89283d191b77	delivered	335.00	\N	2025-10-02 13:54:05.281834	2025-10-05 04:57:24.781351	cod	2025-10-03	0.00	\N
7981cc6e-962c-453f-b3a5-b53cf2b24409	1288b864-f877-43de-bb38-a9fdf25139ba	delivered	405.50	\N	2025-10-02 13:52:12.975953	2025-10-05 04:57:24.826046	cod	2025-10-03	0.00	\N
6941194d-e85e-4b38-b0ee-7bb2bf2818d2	0dfba9c7-26be-434a-8730-81bbba44d911	delivered	160.00	\N	2025-10-03 14:59:03.992157	2025-10-05 04:57:24.828084	cod	2025-10-03	0.00	\N
7be4ede7-db99-4a1f-a120-a0a9a204a967	95483567-3c7b-43d0-9a20-86918e153a09	delivered	805.00	\N	2025-10-03 15:32:58.001585	2025-10-05 04:57:24.842628	cod	2025-10-03	255.00	\N
01e07026-65dd-4cf3-9ca3-fcb1f118db60	f6d70034-ca4c-4fbf-a8bb-c52dc366eaa0	delivered	322.50	\N	2025-10-02 14:22:33.027278	2025-10-05 04:57:24.848828	cod	2025-10-03	0.00	\N
7ea57b31-b69d-40bf-9294-f3b41f1d3bcb	7ff6ecf3-3c66-4b1b-a46d-751f1bf1ca03	delivered	161.00	\N	2025-10-02 14:37:48.691714	2025-10-05 04:57:24.861474	cod	2025-10-03	0.00	\N
372f78c5-11d7-45c5-a84c-8936df48f115	bab4eb84-5c93-41c2-ba24-9de74fa5bfeb	delivered	55.00	\N	2025-10-02 14:17:13.479332	2025-10-05 04:57:24.863445	cod	2025-10-03	0.00	\N
5517851a-b365-4e7e-89bf-89c39993cba0	3a05a7b5-8b15-4587-8c82-2f8c949b9f50	delivered	50.00	\N	2025-10-02 15:30:08.137806	2025-10-05 04:57:24.867897	cod	2025-10-03	0.00	\N
cfc8a832-4613-49f1-a2f8-7dbe3559cb00	ee1e1434-c633-4465-a0b5-daf76ce52557	delivered	145.00	\N	2025-10-02 14:04:57.309113	2025-10-05 04:57:29.726173	cod	2025-10-03	0.00	\N
fa016562-70f4-485d-b87a-9521e754b04d	508d35ee-9499-4a36-a86e-87aea14a19ee	delivered	410.50	\N	2025-10-02 14:11:41.849508	2025-10-05 04:57:29.726408	cod	2025-10-03	0.00	\N
67e1e182-80ea-43c2-882d-6be2e998ad4f	82efca2c-eda9-4458-8eb9-a5746c0380f0	pending	440.00	\N	2025-10-12 03:43:27.788939	2025-10-12 03:46:23.530169	cod	2025-10-12	0.00	\N
58ceba33-35f5-44a0-9eef-83ee3a53090c	57953160-7717-404b-a36f-545877ff4064	pending	195.00	\N	2025-10-11 15:20:02.548098	2025-10-12 05:49:53.094927	cod	2025-10-12	0.00	\N
14076e5c-6c1b-493e-b763-ee8c7086d48e	91071c17-4d9a-4ba3-9696-b1ed80e85093	delivered	260.00	\N	2025-10-07 14:38:45.173037	2025-10-11 15:10:43.109964	cod	2025-10-08	0.00	\N
49e79aff-9b4f-42fe-a104-32b08e1f4d76	45a7f3ee-7708-4f9c-8614-abd65f86fd2f	delivered	103.50	\N	2025-10-07 14:51:57.436727	2025-10-11 15:10:43.158112	cod	2025-10-08	0.00	\N
0d28822d-5cea-4eee-8b9f-91c98ce06a69	d14804c1-315d-437a-9ae6-69f663268eef	delivered	330.00	\N	2025-10-08 03:22:56.399451	2025-10-11 15:10:43.169884	cod	2025-10-08	0.00	\N
c23ac48e-102d-4b75-bd92-876a765202fe	e4033df6-94f0-4b62-bd9c-bd29307f8039	delivered	377.50	\N	2025-10-07 13:17:08.775823	2025-10-11 15:10:43.171465	cod	2025-10-08	0.00	\N
2e4b92c5-45eb-43f0-9e01-c734a262702f	9296d5c2-7f35-4294-bdb1-508ac8610567	delivered	170.00	\N	2025-10-07 15:14:27.738812	2025-10-11 15:10:43.175898	cod	2025-10-08	0.00	\N
8cbcac26-c690-4f3c-9494-b926a4b3f560	cbdd5c3e-c7a8-4e41-90c9-feec771fff18	delivered	392.50	\N	2025-10-07 15:07:18.219718	2025-10-11 15:10:43.185178	cod	2025-10-08	52.50	\N
bb3a8984-bb6f-4ec4-af86-02722198ef57	bab4eb84-5c93-41c2-ba24-9de74fa5bfeb	delivered	90.00	\N	2025-10-07 14:44:17.295939	2025-10-11 15:10:43.18756	cod	2025-10-08	0.00	\N
ff9398e1-3f80-450f-8f82-a9e8b7566a3a	575d4c3b-9545-4844-bee8-72f143e06588	delivered	55.00	\N	2025-10-07 13:20:29.122379	2025-10-11 15:10:48.209719	cod	2025-10-08	0.00	\N
a8ff5b1e-0c8b-4d67-ac9e-5bec9577fc15	b10d3155-4939-4d12-b63b-e6c7f099b2c8	pending	213.50	\N	2025-10-11 15:24:07.99221	2025-10-11 15:24:07.99221	cod	2025-10-12	0.00	\N
b66559cc-bb8d-41e7-bf3f-03d751d0cb1f	852b04f2-6161-4bc8-9c0e-25dfb21843ee	delivered	136.00	Society: The Vienza | Flat: A 902	2025-09-27 15:42:07.581	2025-08-25 19:11:49.855	cod	2025-08-13	0.00	\N
066569cb-c438-45cd-b567-d0a798a2b126	b10d3155-4939-4d12-b63b-e6c7f099b2c8	delivered	90.00	Society: The Vienza | Flat: A 704	2025-09-27 15:42:07.605	2025-08-25 19:12:02.716	cod	2025-08-13	0.00	\N
949670cd-e1fd-4574-85f6-589d45f2ef13	08a309b7-6644-4e01-90fe-3fcd83586473	delivered	325.00	Society: Satyamev Vista | Flat: A904 | Wallet Used: ₹20 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.678	2025-08-25 18:59:39.314	wallet	2025-08-06	100.00	\N
9b31ecd2-7f9e-4dae-952d-8494a013d6a2	bab4eb84-5c93-41c2-ba24-9de74fa5bfeb	delivered	200.00	Society: The Vienza | Flat: A-703 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.707	2025-09-14 19:50:55.953	cod	2025-08-03	100.00	\N
d3b32083-a4c4-4c3e-be3f-bde9ffeb4457	b10d3155-4939-4d12-b63b-e6c7f099b2c8	delivered	100.00	Society: The Vienza | Flat: A 704 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.733	2025-08-25 18:52:57.345	cod	2025-08-03	100.00	\N
4cb656cd-e2a4-49db-a44c-33f20330581f	852b04f2-6161-4bc8-9c0e-25dfb21843ee	delivered	135.00	Society: The Vienza | Flat: A 902 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.758	2025-08-25 18:57:56.277	cod	2025-08-03	100.00	\N
765d40cd-69de-49da-bc91-8d03710f95c8	91071c17-4d9a-4ba3-9696-b1ed80e85093	delivered	188.00	Society: The Vienza | Flat: C-1002 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.785	2025-08-25 19:05:31.845	cod	2025-08-06	0.00	\N
aa11d899-090d-4a7c-8c5e-4101d0358643	b1ff0014-3714-4fb6-a6f2-e8d421667b93	delivered	60.00	Society: The Vienza | Flat: C-502 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.811	2025-08-25 18:55:35.779	cod	2025-08-03	100.00	\N
6f1aa894-2ae8-4850-ba0a-9a65851b177d	31c134a9-aa1c-4841-bab3-dc6b4f839b85	delivered	195.00	Society: Swranim Stown | Flat: C-702 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.836	2025-08-25 19:01:23.63	cod	2025-08-06	0.00	\N
2da2fbc5-f2a1-4273-8ac3-3960793e95ec	78b4661c-3ce5-4159-8aa1-ea92b52f72d0	delivered	125.00	Society: The Vienza | Flat: C-602 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.864	2025-08-25 19:02:42.664	cod	2025-08-06	100.00	\N
db20bc23-558f-4d4e-ab3a-7276c493972e	9051cac2-d198-410c-9e1a-12ddc09a0281	delivered	110.00	Society: The Vienza | Flat: C-202 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.891	2025-08-25 18:52:07.867	cod	2025-08-03	110.00	\N
a3d1b5f2-8780-488d-8f16-f2df4a7e7173	df7645e2-ac6a-46fa-9244-164e79475367	delivered	145.00	Society: The Vienza | Flat: B-1102 | Delivery Day: Sunday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.915	2025-08-25 18:52:39.768	cod	2025-08-03	100.00	\N
858e19b9-f6df-4e61-8828-bb18b7967f59	bab4eb84-5c93-41c2-ba24-9de74fa5bfeb	delivered	100.00	Society: The Vienza | Flat: A-703 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.943	2025-08-25 19:01:54.699	cod	2025-08-06	0.00	\N
e342bd71-4bb2-469f-9b4e-f07cd0e14d40	30a179a7-bafe-4412-8383-0e194cfb6b6a	delivered	235.00	Society: The Vienza | Flat: C-1104 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.966	2025-08-25 19:02:26.848	cod	2025-08-06	0.00	\N
4c655e8f-b82c-4a24-943b-286255ffc0d1	f9e98b36-4c63-4f48-8842-f2650e599429	delivered	336.00	Society: The Vienza | Flat: A-402 | Delivery Day: Wednesday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:06.99	2025-08-25 19:03:09.102	cod	2025-08-06	100.00	\N
ffa545d4-ea0e-4d9e-ab86-75c9e41ac5e6	508d35ee-9499-4a36-a86e-87aea14a19ee	delivered	108.00	Society: The Vienza | Flat: A-604 | Delivery Day: Friday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:07.06	2025-08-25 19:08:11.518	cod	2025-08-08	0.00	\N
5236f491-da1a-49b0-84ee-14bbe8d2ec2e	b10d3155-4939-4d12-b63b-e6c7f099b2c8	delivered	83.00	Society: The Vienza | Flat: A 704 | Delivery Day: Friday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:07.119	2025-08-25 19:08:24.816	cod	2025-08-08	0.00	\N
cffce6bf-6b3d-4c7c-adf8-fc62a99668ba	59fb23ae-d1db-4848-81c3-dd81c18b9c03	delivered	95.00	Society: The Vienza | Flat: C 601 | Delivery Day: Friday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:07.144	2025-08-25 19:08:38.443	cod	2025-08-08	0.00	\N
d9c20473-982d-4f89-bb1c-65a2e262612f	78b4661c-3ce5-4159-8aa1-ea92b52f72d0	delivered	60.00	Society: The Vienza | Flat: C-602 | Delivery Day: Friday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:07.202	2025-08-25 19:08:52.698	cod	2025-08-08	0.00	\N
8ef0d56c-432e-4852-9897-8f44facd15b0	31c134a9-aa1c-4841-bab3-dc6b4f839b85	delivered	110.00	Society: Swranim Stown | Flat: C-702 | Delivery Day: Friday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:07.226	2025-08-25 19:09:06.699	cod	2025-08-08	0.00	\N
13e94e18-054f-46e8-9a88-1ccb2b967cfc	9051cac2-d198-410c-9e1a-12ddc09a0281	delivered	110.00	Society: The Vienza | Flat: C-202 | Delivery Day: Friday | Order Period: August/2025 | Week: 2	2025-09-27 15:42:07.25	2025-08-25 19:09:20.947	cod	2025-08-08	0.00	\N
666df3c7-55ec-4fbd-bac5-28c4f072d2b0	d93386aa-42b0-403a-998b-ac94c410a7fd	delivered	70.00	Society: The Vienza | Flat: A-602 | Delivery Day: Sunday | Order Period: August/2025 | Week: 3	2025-09-27 15:42:07.274	2025-08-25 19:09:34.303	cod	2025-08-10	0.00	\N
38bcec07-15c2-40bc-9729-d4d66b354343	64e589f8-2394-4921-8351-b19082e45e59	delivered	125.00	Society: The Vienza | Flat: B602 | Delivery Day: Sunday | Order Period: August/2025 | Week: 3	2025-09-27 15:42:07.3	2025-08-25 20:22:14.522	cod	2025-08-10	0.00	\N
8a9a1137-0eba-4d93-ab35-11d427fa9ce8	e3ed9081-7304-47e4-a96f-1269fc73810e	delivered	90.00	Society: The Vienza | Flat: B802 | Wallet Used: ₹90	2025-09-27 15:42:07.331	2025-08-24 13:27:47.193	wallet	2025-08-10	0.00	\N
87522583-7317-4ec0-97c3-fdd663425e5b	b1ff0014-3714-4fb6-a6f2-e8d421667b93	delivered	140.00	Society: The Vienza | Flat: C-502	2025-09-27 15:42:07.353	2025-08-24 13:27:47.221	cod	2025-08-07	0.00	\N
ac94b2f0-e2a6-40f2-bd28-81212f817ecc	d93386aa-42b0-403a-998b-ac94c410a7fd	delivered	75.00	Society: The Vienza | Flat: A-602	2025-09-27 15:42:07.378	2025-08-25 19:10:03.162	cod	2025-08-06	0.00	\N
0fe79e91-aab9-45f8-91bc-b511759f894f	77688538-8035-4580-8ec1-c565caa1ef17	delivered	140.00	Society: The Vienza | Flat: A-701 -> A-901	2025-09-27 15:42:07.401	2025-08-24 13:27:47.267	cod	2025-08-10	0.00	\N
bf0d2bd8-5752-4940-9067-95bbee22d55d	9296d5c2-7f35-4294-bdb1-508ac8610567	delivered	80.00	Society: Tulshi Heights | Flat: B-601	2025-09-27 15:42:07.424	2025-08-25 19:10:21.601	cod	2025-08-13	0.00	\N
166ddebe-3b71-42a1-99ca-57111d4f195f	f6d70034-ca4c-4fbf-a8bb-c52dc366eaa0	delivered	151.00	Flat: C1203	2025-09-27 15:42:07.45	2025-08-25 19:10:33.862	cod	2025-08-13	0.00	\N
9562afc2-08bc-4b9a-8182-bd796f732e84	e3ed9081-7304-47e4-a96f-1269fc73810e	delivered	75.00	Society: The Vienza | Flat: B 802 | Wallet Used: ₹75	2025-09-27 15:42:07.487	2025-08-25 19:10:48.912	wallet	2025-08-13	0.00	\N
957082da-051e-46f6-b258-6cfb3a54b3ba	f9e98b36-4c63-4f48-8842-f2650e599429	delivered	293.00	Society: The Vienza | Flat: A-402	2025-09-27 15:42:07.515	2025-08-25 19:11:00.542	cod	2025-08-13	0.00	\N
f27347b8-c4ea-40a5-bc79-61b060d47dc9	1288b864-f877-43de-bb38-a9fdf25139ba	delivered	410.00	Society: The Vienza | Flat: A-603	2025-09-27 15:42:07.545	2025-08-25 19:11:14.226	cod	2025-08-13	0.00	\N
5fe1f299-fb2f-4628-9ee4-c23c80cecda5	508d35ee-9499-4a36-a86e-87aea14a19ee	delivered	120.00	Society: The Vienza | Flat: A-604	2025-09-27 15:42:07.629	2025-08-25 19:12:16.608	cod	2025-08-13	0.00	\N
ef742e35-4021-4c94-a0b5-15af92a03203	30a179a7-bafe-4412-8383-0e194cfb6b6a	delivered	288.00	Society: The Vienza | Flat: C-1104	2025-09-27 15:42:07.667	2025-08-25 19:12:29.871	cod	2025-08-13	0.00	\N
476f4057-847b-48e3-805a-34dc5f1c7b63	d93386aa-42b0-403a-998b-ac94c410a7fd	delivered	148.00	Society: The Vienza | Flat: A-602	2025-09-27 15:42:07.693	2025-08-25 19:12:47.828	cod	2025-08-13	0.00	\N
c245f393-4614-44df-ba88-964acde66c4c	9051cac2-d198-410c-9e1a-12ddc09a0281	delivered	170.00	Society: The Vienza | Flat: C-202	2025-09-27 15:42:07.723	2025-08-25 19:13:04.638	cod	2025-08-13	0.00	\N
35ae2124-ec0a-4fe0-9550-74343a0864f3	73a77b18-546f-4295-b1ce-7ca9398f895d	delivered	60.00	Society: The Vienza | Flat: A 101	2025-09-27 15:42:07.745	2025-08-25 19:13:21.352	cod	2025-08-13	0.00	\N
0c491ae1-8e9c-4b1e-bdc3-a574fac32d5b	11dfff00-3c8b-416f-9a4a-3b7a1480083d	delivered	20.00	Society: The Vienza | Flat: A -802	2025-09-27 15:42:07.77	2025-08-25 19:13:40.221	cod	2025-08-13	0.00	\N
7cf31a95-f5ba-4405-9b18-b6ec178510d9	b10d3155-4939-4d12-b63b-e6c7f099b2c8	delivered	60.00	Society: The Vienza | Flat: A 704	2025-09-27 15:42:07.791	2025-08-25 18:56:41.126	cod	2025-08-13	0.00	\N
515b6660-8365-4296-8a30-ceb64db50b17	d14804c1-315d-437a-9ae6-69f663268eef	delivered	70.00	Society: The Vienza | Flat: A-202	2025-09-27 15:42:07.819	2025-08-25 19:14:01.278	cod	2025-08-13	0.00	\N
c1276a53-e47e-42eb-a8fc-c0893f744af9	83ba0368-cde5-4cd5-960b-89283d191b77	delivered	80.00	Flat: A 1202	2025-09-27 15:42:07.847	2025-08-25 19:15:28.138	cod	2025-08-14	0.00	\N
a1e1f4e2-943a-4f8a-996f-fe8c2943c8f0	0dfba9c7-26be-434a-8730-81bbba44d911	delivered	158.00	Society: The Vienza | Flat: B-902	2025-09-27 15:42:07.874	2025-08-25 19:16:21.746	cod	2025-08-22	0.00	\N
2cc32a66-c17b-4b26-bc87-18925a56e9aa	e3ed9081-7304-47e4-a96f-1269fc73810e	delivered	75.00	Society: The Vienza | Flat: B 802 | Wallet Used: ₹75	2025-09-27 15:42:07.902	2025-08-25 19:16:37.633	wallet	2025-08-22	0.00	\N
53bb26e9-b069-489d-a732-418aa5d25cc1	b6ed41d6-3855-4be9-8556-509649f98ea3	delivered	245.00	Society: The Vienza | Flat: C-503	2025-09-27 15:42:07.927	2025-08-25 19:16:50.834	cod	2025-08-22	0.00	\N
8a6ba159-07b9-4a29-b2bc-a80b58bf3034	31c134a9-aa1c-4841-bab3-dc6b4f839b85	delivered	268.00	Society: Swranim Stown | Flat: C-702	2025-09-27 15:42:07.959	2025-08-25 19:17:04.005	cod	2025-08-22	0.00	\N
313918ab-5783-43fb-8b63-14e0b45b60f8	4c20c147-b762-4842-a089-8cc3aed679eb	delivered	240.00	Society: The Vienza | Flat: C1101	2025-09-27 15:42:07.984	2025-08-25 19:17:16.797	cod	2025-08-22	0.00	\N
69e50dc5-d6d9-43c7-b72d-39e653a09ee4	b572d8f9-3a0e-4b04-aaa1-fd0ed946244e	delivered	182.50	\N	2025-09-27 14:32:21.681507	2025-10-02 13:14:22.261418	cod	2025-09-28	0.00	\N
9cb75236-6396-4911-8706-b5de3daad2f8	bab4eb84-5c93-41c2-ba24-9de74fa5bfeb	delivered	326.00	Society: The Vienza | Flat: A-703	2025-09-27 15:42:09.222	2025-09-08 20:49:00.751	cod	2025-09-04	20.00	\N
3d2be6c4-9c87-4b52-93fa-b7194cfbf831	45a7f3ee-7708-4f9c-8614-abd65f86fd2f	delivered	115.00	Society: The Vienza | Flat: C 903	2025-09-27 15:42:09.253	2025-09-08 20:48:45.549	cod	2025-09-04	0.00	\N
6cf08f3d-4353-4feb-8c90-98ed438c57a5	82efca2c-eda9-4458-8eb9-a5746c0380f0	delivered	440.00	\N	2025-09-27 14:39:00.287512	2025-10-02 13:14:22.237734	cod	2025-09-28	0.00	\N
bdee3fdf-84fe-449b-8573-9a377bdff650	b10d3155-4939-4d12-b63b-e6c7f099b2c8	delivered	205.00	Society: The Vienza | Flat: A 704	2025-09-27 15:42:09.283	2025-09-08 20:48:30.107	cod	2025-09-04	0.00	\N
32c83fbe-a364-4b30-b6c7-ab6826e34ed1	d93386aa-42b0-403a-998b-ac94c410a7fd	delivered	133.00	Society: The Vienza | Flat: A-602	2025-09-27 15:42:09.308	2025-09-08 20:48:15.082	cod	2025-09-04	0.00	\N
4e15bbce-85ad-467d-8f1f-6113d148bb96	3a05a7b5-8b15-4587-8c82-2f8c949b9f50	delivered	153.00	Society: The Vienza | Flat: B-1104	2025-09-27 15:42:09.347	2025-09-08 20:47:43.746	cod	2025-09-04	0.00	\N
7aa449e4-1f8e-4de9-9ee4-24eda6513f16	575d4c3b-9545-4844-bee8-72f143e06588	delivered	100.00	Society: The Vienza | Flat: A-1102	2025-09-27 15:42:09.39	2025-09-08 20:47:27.909	cod	2025-09-04	0.00	\N
2ed1f8c5-9c24-467b-93da-4c741716b627	83ba0368-cde5-4cd5-960b-89283d191b77	delivered	250.00	Society: The Vienza | Flat: A 1202	2025-09-27 15:42:09.415	2025-09-08 20:47:13.071	cod	2025-09-04	0.00	\N
16ae549d-a7ba-4ca3-9ca0-b50056a90135	59fb23ae-d1db-4848-81c3-dd81c18b9c03	delivered	120.00	Society: The Vienza | Flat: C 601	2025-09-27 15:42:09.44	2025-09-08 20:46:57.535	cod	2025-09-04	0.00	\N
cace3681-4b37-44f1-9ef0-d5a01c4017d4	30a179a7-bafe-4412-8383-0e194cfb6b6a	delivered	186.00	Society: The Vienza | Flat: C-1104	2025-09-27 15:42:08.013	2025-08-25 19:17:30.497	cod	2025-08-22	0.00	\N
ad6596e0-5bdc-4730-a0a3-2bed45b9a5cc	9051cac2-d198-410c-9e1a-12ddc09a0281	delivered	130.00	Society: The Vienza | Flat: C-202	2025-09-27 15:42:08.04	2025-08-25 19:18:00.943	cod	2025-08-22	0.00	\N
7e0d1981-de41-41fa-8443-0af742c3da6d	11dfff00-3c8b-416f-9a4a-3b7a1480083d	delivered	45.00	Society: The Vienza | Flat: A -802	2025-09-27 15:42:08.063	2025-08-25 19:18:18.556	cod	2025-08-22	0.00	\N
d7b7c971-0a43-46a4-b18f-aea3f1044e85	d14804c1-315d-437a-9ae6-69f663268eef	delivered	228.00	Society: The Vienza | Flat: A-202	2025-09-27 15:42:08.085	2025-08-25 19:18:35.478	cod	2025-08-22	0.00	\N
f54dd8f4-9e9f-4913-9277-53925fb29c15	b3833c23-20c7-4f01-86b6-cfbe076177c8	delivered	110.00	Society: Swranim Stown | Flat: C 704	2025-09-27 15:42:08.113	2025-08-25 18:55:52.011	cod	2025-08-22	0.00	\N
f88b1081-2eaa-47d8-94fa-34b1bccd940a	508d35ee-9499-4a36-a86e-87aea14a19ee	delivered	140.00	Society: The Vienza | Flat: A-604	2025-09-27 15:42:08.157	2025-08-25 18:56:24.92	cod	2025-08-22	0.00	\N
80347a8a-5d53-4cde-be7a-868d14b85afb	b10d3155-4939-4d12-b63b-e6c7f099b2c8	delivered	160.00	Society: The Vienza | Flat: A 704	2025-09-27 15:42:08.181	2025-08-25 19:19:10.746	cod	2025-08-22	0.00	\N
69cec71c-b15b-446e-b065-76969f4573b0	bab4eb84-5c93-41c2-ba24-9de74fa5bfeb	delivered	130.00	Society: The Vienza | Flat: A-703	2025-09-27 15:42:08.21	2025-08-25 19:19:27.528	cod	2025-08-22	0.00	\N
e67d39aa-98c3-435c-9407-3b8d178d9308	117e9890-424b-4214-ab5e-de1aa198da10	delivered	195.00	Society: The Vienza | Flat: A903	2025-09-27 15:42:08.234	2025-08-25 19:16:03.972	cod	2025-08-22	0.00	\N
f0eb3c49-3d48-410e-90a9-7df8cb608a9a	82efca2c-eda9-4458-8eb9-a5746c0380f0	delivered	160.00	Society: The Vienza | Flat: A1001	2025-09-27 15:42:08.259	2025-08-25 19:14:37.794	cod	2025-08-22	0.00	\N
7feecf15-742d-4089-997c-0187e755d5f0	83ba0368-cde5-4cd5-960b-89283d191b77	delivered	188.00	Society: The Vienza | Flat: A 1202	2025-09-27 15:42:08.285	2025-08-25 19:14:20.503	cod	2025-08-22	0.00	\N
9091cdea-e417-4417-8c4f-00171bae88c4	42db859d-2b6d-413a-995c-ecfcc592efec	delivered	360.00	Society: The Vienza | Flat: C-1001	2025-09-27 15:42:08.316	2025-08-25 18:56:09.752	cod	2025-08-22	0.00	\N
dbff1e87-2699-44b8-9d03-2e0b0b2ba8ef	852b04f2-6161-4bc8-9c0e-25dfb21843ee	delivered	195.00	Society: The Vienza | Flat: A 902	2025-09-27 15:42:08.343	2025-08-25 18:50:50.756	cod	2025-08-22	0.00	\N
397fbbcb-7e09-4921-8523-4bdcbf0cc1a7	30a179a7-bafe-4412-8383-0e194cfb6b6a	delivered	40.00	Society: The Vienza | Flat: C 1104	2025-09-27 15:42:08.368	2025-08-24 13:27:48.106	cod	2025-08-22	0.00	\N
fb9c755f-18dc-4059-899b-e945874cfdbd	f6d70034-ca4c-4fbf-a8bb-c52dc366eaa0	delivered	200.00	Society: The Vienza | Flat: C1203	2025-09-27 15:42:08.388	2025-09-14 20:05:49.396	cod	2025-08-22	0.00	\N
8d76300f-0c02-44c6-a9de-578342a7b1ee	08a309b7-6644-4e01-90fe-3fcd83586473	delivered	300.00	Society: Satyamev Vista | Flat: A904	2025-09-27 15:42:08.416	2025-08-24 13:27:48.156	cod	2025-08-22	0.00	\N
0cc7a61c-145b-4609-b618-a45d8351d1c2	31c134a9-aa1c-4841-bab3-dc6b4f839b85	delivered	0.00	Society: Swranim Stown | Flat: C-702	2025-09-27 15:42:08.444	2025-08-25 19:38:16.514	cod	2025-08-22	0.00	\N
eee2160f-b55c-4cc9-90ef-48e5bd5b8a31	78b4661c-3ce5-4159-8aa1-ea92b52f72d0	delivered	180.00	Society: The Vienza | Flat: C-602	2025-09-27 15:42:08.484	2025-08-24 13:27:48.199	cod	2025-08-24	54.00	\N
d853efe4-df32-48b5-9e92-bed8df90e6ee	581736df-45e2-4d92-b3de-c5d1e075f05a	delivered	160.00	Flat: B604	2025-09-27 15:42:08.531	2025-08-24 13:27:48.269	cod	2025-08-24	48.00	\N
5ada5f7a-da50-4ac1-b6ee-17e7d4391aed	f9e98b36-4c63-4f48-8842-f2650e599429	delivered	105.00	Society: The Vienza | Flat: A-402	2025-09-27 15:42:08.555	2025-08-24 13:27:48.293	cod	2025-08-24	31.00	\N
ddaa9c9f-eb35-49e7-884d-4f1b9d1c4ada	9296d5c2-7f35-4294-bdb1-508ac8610567	delivered	150.00	Society: Tulshi Heights | Flat: B-601	2025-09-27 15:42:08.579	2025-08-24 20:36:23.081	cod	2025-08-24	45.00	\N
7604530b-f203-4971-8fcb-2509b62ee25a	bab4eb84-5c93-41c2-ba24-9de74fa5bfeb	delivered	70.00	Society: The Vienza | Flat: A-703	2025-09-27 15:42:08.607	2025-08-25 18:15:15.646	cod	2025-08-24	20.00	\N
191fafe4-81f1-406b-ab83-0b2a169111d2	b10d3155-4939-4d12-b63b-e6c7f099b2c8	delivered	90.00	Society: The Vienza | Flat: A 704	2025-09-27 15:42:08.63	2025-08-25 18:15:31.262	cod	2025-08-24	27.00	\N
76ed92de-e4f2-4f62-84d0-17bfd5395530	e3ed9081-7304-47e4-a96f-1269fc73810e	delivered	80.00	Society: The Vienza | Flat: B 802 | Wallet Used: ₹56	2025-09-27 15:42:08.653	2025-08-25 18:15:53.021	wallet	2025-08-24	24.00	\N
2dfdd519-d012-4b85-832e-bef3a6795850	91071c17-4d9a-4ba3-9696-b1ed80e85093	delivered	215.00	Society: The Vienza | Flat: C-1002	2025-09-27 15:42:08.68	2025-08-25 18:13:40.809	cod	2025-08-25	65.00	\N
23fd0ace-9691-4a3d-9ed3-1aa4766c8439	852b04f2-6161-4bc8-9c0e-25dfb21843ee	delivered	75.00	Society: The Vienza | Flat: A 902	2025-09-27 15:42:08.931	2025-08-25 18:13:22.299	cod	2025-08-25	22.00	\N
36ffc8c2-40ba-4105-914a-cba4a52ba7b5	b6ed41d6-3855-4be9-8556-509649f98ea3	delivered	179.00	Society: The Vienza | Flat: C-503	2025-09-27 15:42:08.955	2025-09-08 20:45:01.504	cod	2025-09-04	0.00	\N
e00cf6fe-42d9-4e6c-89aa-2550271f341e	31c134a9-aa1c-4841-bab3-dc6b4f839b85	delivered	105.00	Society: Swranim Stown | Flat: C-702	2025-09-27 15:42:09.008	2025-09-08 20:48:01.619	cod	2025-09-04	0.00	\N
e7e62d26-e4be-4145-be6d-1c3e26b9be9b	30a179a7-bafe-4412-8383-0e194cfb6b6a	delivered	269.00	Society: The Vienza | Flat: C-1104	2025-09-27 15:42:09.037	2025-09-08 20:50:25.386	cod	2025-09-04	0.00	\N
b58c104e-2e12-4801-9c30-6d97228c8b79	508d35ee-9499-4a36-a86e-87aea14a19ee	delivered	228.00	Society: The Vienza | Flat: A-604	2025-09-27 15:42:09.09	2025-09-08 20:50:11.347	cod	2025-09-04	0.00	\N
62b4767d-8433-40fe-bcfb-dd25bf757fa7	d14804c1-315d-437a-9ae6-69f663268eef	delivered	38.00	Society: The Vienza | Flat: A-202	2025-09-27 15:42:09.116	2025-09-08 20:49:58.105	cod	2025-09-04	0.00	\N
0ac618c0-cdd7-438e-ae36-7c2038a6bc74	9296d5c2-7f35-4294-bdb1-508ac8610567	delivered	225.00	Society: Tulshi Heights | Flat: B-601	2025-09-27 15:42:09.14	2025-09-08 20:49:43.688	cod	2025-09-04	0.00	\N
69aa92c7-eaa5-4ee7-9c76-d1fbb1e0f12a	4c20c147-b762-4842-a089-8cc3aed679eb	delivered	291.00	Society: The Vienza | Flat: C1101	2025-09-27 15:42:09.165	2025-09-08 20:49:29.368	cod	2025-09-04	0.00	\N
07f798f8-1089-4701-ace2-6729cc308eb7	0dfba9c7-26be-434a-8730-81bbba44d911	delivered	69.00	Society: The Vienza | Flat: B-902	2025-09-27 15:42:09.198	2025-09-08 20:49:15.086	cod	2025-09-04	0.00	\N
f54420dc-b4f1-4a4c-9306-901a11368483	bbf2b0ae-1138-4c82-a9e8-5de175783faf	delivered	130.00	Society: The Vienza | Flat: A-403	2025-09-27 15:42:09.464	2025-09-08 20:46:41.567	cod	2025-09-04	0.00	\N
26c9c757-3b39-4034-bb9c-3c8cb45d77a5	91071c17-4d9a-4ba3-9696-b1ed80e85093	delivered	248.00	Society: The Vienza | Flat: C-1002	2025-09-27 15:42:09.484	2025-09-08 20:46:27.188	cod	2025-09-04	0.00	\N
8816c271-ac91-4f6f-a30f-7d0da0d68c66	82efca2c-eda9-4458-8eb9-a5746c0380f0	delivered	166.00	Society: The Vienza | Flat: A1001	2025-09-27 15:42:09.513	2025-09-08 20:46:12.771	cod	2025-09-04	0.00	\N
ef6a7f78-5b94-4c82-8a45-c083b343b655	42db859d-2b6d-413a-995c-ecfcc592efec	delivered	289.00	Society: The Vienza | Flat: C-1001	2025-09-27 15:42:09.539	2025-09-08 20:45:58.823	cod	2025-09-04	0.00	\N
4435447d-453e-4683-a9d5-d079c7298148	f9e98b36-4c63-4f48-8842-f2650e599429	delivered	110.00	Society: The Vienza | Flat: A-402	2025-09-27 15:42:09.568	2025-09-08 20:45:44.704	cod	2025-09-04	0.00	\N
d2294a03-f04c-4e74-9123-4342f0a9e4e5	852b04f2-6161-4bc8-9c0e-25dfb21843ee	delivered	138.00	Society: The Vienza | Flat: A 902	2025-09-27 15:42:09.588	2025-09-08 20:45:31.426	cod	2025-09-04	0.00	\N
66bec82a-e572-453c-8512-d1d5a1fd65f2	78b4661c-3ce5-4159-8aa1-ea92b52f72d0	delivered	86.00	Society: The Vienza | Flat: C-602	2025-09-27 15:42:09.614	2025-09-08 20:45:17.428	cod	2025-09-04	0.00	\N
71210f59-d9e0-43c8-927b-7219c4dd9580	e3ed9081-7304-47e4-a96f-1269fc73810e	delivered	70.00	Society: The Vienza | Flat: B 802 | Wallet Used: ₹70	2025-09-27 15:42:09.689	2025-09-08 20:41:01.692	wallet	2025-09-04	0.00	\N
809a1a6c-a19c-4d65-89a8-fa9b005b9297	98a27a1c-4f43-45f0-b6d8-2c5165327730	delivered	83.00	Society: The Vienza | Flat: C1403	2025-09-27 15:42:09.714	2025-09-08 20:40:27.983	cod	2025-09-04	0.00	\N
0c426b8e-27c2-4e6b-96a0-b978408bd043	b572d8f9-3a0e-4b04-aaa1-fd0ed946244e	delivered	180.00	Society: The Vienza | Flat: B1001	2025-09-27 15:42:09.748	2025-09-08 20:40:13.231	cod	2025-09-04	0.00	\N
42da418f-d58b-4c8e-8424-dbf3d067cd9c	57953160-7717-404b-a36f-545877ff4064	delivered	275.00	Flat: B 703	2025-09-27 15:42:11.66	2025-09-27 10:14:25.904632	cod	2025-09-18	0.00	\N
12f61f2a-49ba-41e2-810b-4dfd15c49201	508d35ee-9499-4a36-a86e-87aea14a19ee	delivered	263.00	Society: The Vienza | Flat: A-604	2025-09-27 15:42:11.685	2025-09-27 10:14:25.909253	cod	2025-09-18	0.00	\N
ac5b044c-157d-4445-bd11-b657e9bdc7ec	d93386aa-42b0-403a-998b-ac94c410a7fd	delivered	256.00	Society: The Vienza | Flat: A-602	2025-09-27 15:42:11.608	2025-09-27 16:24:19.707007	monthly	2025-09-18	0.00	6d7d0076-147e-4d21-a567-88ab74c31db2
125482b8-aed9-4297-9624-dbad6cdc09b7	d5429c6e-5172-48ff-b24a-dd4a0896b9e3	delivered	152.00	Flat: C702	2025-09-27 15:42:11.312	2025-09-14 19:42:45.752	cod	2025-09-10	0.00	\N
b2f5b35e-495d-41f4-97de-aa460b42b3a5	30a179a7-bafe-4412-8383-0e194cfb6b6a	delivered	155.00	Society: The Vienza | Flat: C-1104	2025-09-27 15:42:11.333	2025-09-14 19:43:02.05	cod	2025-09-10	0.00	\N
4f84144c-3b8c-411f-b5bc-9d0f7c73a5ab	11dfff00-3c8b-416f-9a4a-3b7a1480083d	delivered	40.00	Society: The Vienza | Flat: A -802	2025-09-27 15:42:10.173	2025-09-08 20:35:01.744	monthly	2025-09-06	0.00	\N
6f75e436-f15f-4115-808e-cc74946cfb71	e3ed9081-7304-47e4-a96f-1269fc73810e	delivered	38.00	Society: The Vienza | Flat: B 802 | Wallet Used: ₹38	2025-09-27 15:42:11.362	2025-09-14 19:43:52.07	wallet	2025-09-11	0.00	\N
efc47bb6-cc7b-4959-bcbb-16e2a5a80b0b	d14804c1-315d-437a-9ae6-69f663268eef	delivered	95.00	Society: The Vienza | Flat: A-202	2025-09-27 15:42:11.401	2025-09-14 19:44:05.344	cod	2025-09-11	0.00	\N
cab4e6b3-6e07-4f2e-a06d-3b904b822f7f	11dfff00-3c8b-416f-9a4a-3b7a1480083d	delivered	121.00	Society: The Vienza | Flat: A -802	2025-09-27 15:42:11.019	2025-09-14 19:41:30.312	monthly	2025-09-10	0.00	\N
f134b614-304d-439b-b6fa-0add71c1a1b1	42db859d-2b6d-413a-995c-ecfcc592efec	delivered	70.00	Society: The Vienza | Flat: C-1001	2025-09-27 15:42:11.427	2025-09-14 19:44:18.041	cod	2025-09-11	0.00	\N
495c36e3-9b48-499c-93dd-cf19cea35bc0	d5429c6e-5172-48ff-b24a-dd4a0896b9e3	delivered	115.00	Society: The Vienza | Flat: C702	2025-09-27 15:42:09.773	2025-09-08 20:39:54.957	cod	2025-09-04	0.00	\N
db80cec6-b816-41c0-887c-762ec7a3ecf6	c957abc0-fd67-4ad9-b9f4-de8a5ad4c6a1	delivered	305.00	Society: The Vienza | Flat: A803	2025-09-27 15:42:09.797	2025-09-08 20:39:32.257	cod	2025-09-04	0.00	\N
b5c68a8f-821b-4b92-8f9c-88372dac0d13	d3a63b74-30b5-4fa9-96dd-cc724fa26b54	delivered	33.00	Society: The Vienza | Flat: A804	2025-09-27 15:42:09.826	2025-09-08 20:39:11.502	cod	2025-09-04	0.00	\N
61785ee4-466b-414b-8253-048fb0d63f25	b4c0c351-1d47-4bca-9470-121e91100db1	delivered	60.00	Society: The Vienza | Flat: A901	2025-09-27 15:42:09.85	2025-09-08 20:38:56.275	cod	2025-09-04	0.00	\N
23abb815-d971-465f-92de-d13cb9fe71b5	f6d70034-ca4c-4fbf-a8bb-c52dc366eaa0	delivered	85.00	Society: The Vienza | Flat: C1203	2025-09-27 15:42:09.884	2025-09-08 20:38:38.95	cod	2025-09-04	0.00	\N
6ee50630-a12c-4ad6-b5ac-2b49aeaa0f45	98a27a1c-4f43-45f0-b6d8-2c5165327730	delivered	231.00	Flat: C1403	2025-09-27 15:42:09.91	2025-09-09 20:04:57.541	cod	2025-09-04	0.00	\N
9f0eb33e-17cb-4788-9b28-a13c463449e1	9051cac2-d198-410c-9e1a-12ddc09a0281	delivered	179.00	Society: The Vienza | Flat: C-202	2025-09-27 15:42:09.934	2025-09-08 20:37:04.711	cod	2025-09-04	0.00	\N
573dd109-a104-4222-b4ad-2aa7f227aebb	b3833c23-20c7-4f01-86b6-cfbe076177c8	delivered	145.00	Society: Swranim Stown | Flat: C 704	2025-09-27 15:42:09.964	2025-09-08 20:34:45.854	cod	2025-09-04	0.00	\N
a6d963ae-a8c9-4d72-ad48-e81c0c0950bd	e6027508-add9-4b40-9876-2e81be9e230b	delivered	315.00	Society: The Vienza | Flat: B 301	2025-09-27 15:42:09.992	2025-09-08 20:36:38.524	cod	2025-09-05	0.00	\N
72305b9c-d208-4480-a808-c00bb3cf11d9	98a27a1c-4f43-45f0-b6d8-2c5165327730	delivered	58.00	Flat: C1403	2025-09-27 15:42:10.022	2025-09-08 20:36:21.157	cod	2025-09-06	0.00	\N
655e4279-48ca-4d17-8d49-7ad26d1481f1	f9e98b36-4c63-4f48-8842-f2650e599429	delivered	123.00	Society: The Vienza | Flat: A-402	2025-09-27 15:42:10.044	2025-09-08 20:36:05.754	cod	2025-09-06	0.00	\N
429e940e-a5f7-4d90-9f67-529e70274c6a	59fb23ae-d1db-4848-81c3-dd81c18b9c03	delivered	60.00	Society: The Vienza | Flat: C 601	2025-09-27 15:42:10.076	2025-09-08 20:35:49.815	cod	2025-09-06	0.00	\N
98e9c093-283c-4902-aa56-9f6793428f67	d93386aa-42b0-403a-998b-ac94c410a7fd	delivered	55.00	Society: The Vienza | Flat: A-602	2025-09-27 15:42:10.099	2025-09-08 20:35:34.972	cod	2025-09-06	0.00	\N
45b8a7ab-d6eb-40d3-93b3-08ee67324a85	bbf2b0ae-1138-4c82-a9e8-5de175783faf	delivered	170.00	Society: The Vienza | Flat: A-403	2025-09-27 15:42:10.144	2025-09-08 20:35:18.727	cod	2025-09-06	0.00	\N
da998aee-c31d-4ee7-ab17-797394c85ccf	575d4c3b-9545-4844-bee8-72f143e06588	delivered	60.00	Society: The Vienza | Flat: A-1102	2025-09-27 15:42:10.214	2025-09-14 19:34:13.081	cod	2025-09-10	0.00	\N
b92f776f-65e5-4ad7-8050-f1f5ebea412c	78b4661c-3ce5-4159-8aa1-ea92b52f72d0	delivered	53.00	Society: The Vienza | Flat: C-602	2025-09-27 15:42:10.239	2025-09-14 19:34:38.127	cod	2025-09-10	0.00	\N
6f8752d2-3200-4a18-9ee9-04023301a844	d93386aa-42b0-403a-998b-ac94c410a7fd	delivered	135.00	Society: The Vienza | Flat: A-602	2025-09-27 15:42:10.261	2025-09-14 19:34:56.198	cod	2025-09-10	0.00	\N
87b4f7ed-fd5a-449e-abb7-7cfd7e5a8e8a	d3a63b74-30b5-4fa9-96dd-cc724fa26b54	delivered	144.00	Flat: A804	2025-09-27 15:42:10.289	2025-09-14 19:35:10.978	cod	2025-09-10	0.00	\N
cecaa1ab-6807-4eb8-aab0-e76730785001	bab4eb84-5c93-41c2-ba24-9de74fa5bfeb	delivered	101.00	Society: The Vienza | Flat: A-703	2025-09-27 15:42:10.321	2025-09-14 19:35:25.861	cod	2025-09-10	0.00	\N
7b56fc26-de77-4d5d-a5ce-35603337a085	6187a88d-d45f-412d-bf18-a70288520cba	delivered	247.00	Society: The Vienza | Flat: B 501	2025-09-27 15:42:10.348	2025-09-14 19:35:43.076	cod	2025-09-10	0.00	\N
846705c1-aa4c-4657-9860-d081033f93f5	bbf2b0ae-1138-4c82-a9e8-5de175783faf	delivered	65.00	Society: The Vienza | Flat: A-403	2025-09-27 15:42:10.378	2025-09-14 19:36:15.22	cod	2025-09-10	0.00	\N
be5e531c-27df-4c0d-9f8a-2ec817c7e8a4	df7645e2-ac6a-46fa-9244-164e79475367	delivered	68.00	Society: The Vienza | Flat: B-1102	2025-09-27 15:42:10.401	2025-09-14 19:36:29.451	cod	2025-09-10	0.00	\N
13bdb66a-a51f-4e30-b113-cc4f296368eb	b10d3155-4939-4d12-b63b-e6c7f099b2c8	delivered	303.00	Society: The Vienza | Flat: A 704	2025-09-27 15:42:10.427	2025-09-14 19:36:43.859	cod	2025-09-10	0.00	\N
f6599666-fab4-4fa4-9b6e-867be170064f	98a27a1c-4f43-45f0-b6d8-2c5165327730	delivered	290.00	Flat: C1403	2025-09-27 15:42:10.455	2025-09-14 19:36:58.798	cod	2025-09-10	0.00	\N
e17b2b1e-850e-4d0d-9548-aca9f67af5c3	575d4c3b-9545-4844-bee8-72f143e06588	delivered	158.00	Society: The Vienza | Flat: A-1102	2025-09-27 15:42:10.48	2025-09-14 19:37:13.193	cod	2025-09-10	0.00	\N
1b27bc7b-1d71-4bb4-abd1-551c94da97c4	c957abc0-fd67-4ad9-b9f4-de8a5ad4c6a1	delivered	473.00	Society: The Vienza | Flat: A803	2025-09-27 15:42:10.507	2025-09-14 19:37:28.294	cod	2025-09-10	0.00	\N
29719aa0-d2bb-42b8-bc6c-77816ce73164	59fb23ae-d1db-4848-81c3-dd81c18b9c03	delivered	180.00	Society: The Vienza | Flat: C 601	2025-09-27 15:42:10.577	2025-09-14 19:37:42.689	cod	2025-09-10	0.00	\N
cff52a74-4fe0-4ba7-a6a0-6eb68e69879b	852b04f2-6161-4bc8-9c0e-25dfb21843ee	delivered	105.00	Society: The Vienza | Flat: A 902	2025-09-27 15:42:10.619	2025-09-14 19:37:58.781	cod	2025-09-10	0.00	\N
f840ef56-568e-4b80-9dd2-1beb8105f749	83ba0368-cde5-4cd5-960b-89283d191b77	delivered	228.00	Society: The Vienza | Flat: A 1202	2025-09-27 15:42:10.766	2025-09-14 19:38:13.968	cod	2025-09-10	0.00	\N
eeb9ea35-5047-4c3e-ac32-eb3dd8845b07	57953160-7717-404b-a36f-545877ff4064	delivered	100.00	Society: The Vienza | Flat: B 703	2025-09-27 15:42:10.801	2025-09-14 19:38:28.004	cod	2025-09-10	0.00	\N
9301e77d-2381-43bd-bd3e-3b829a7182a1	52e679f8-cd31-41f4-a453-8c709b9e525f	delivered	55.00	Society: The Vienza | Flat: B 403	2025-09-27 15:42:10.844	2025-09-14 19:38:45.408	cod	2025-09-10	0.00	\N
61dcea35-c5da-4395-83aa-333ceace0c24	91071c17-4d9a-4ba3-9696-b1ed80e85093	delivered	230.00	Society: The Vienza | Flat: C-1002	2025-09-27 15:42:10.921	2025-09-14 19:39:01.303	cod	2025-09-10	0.00	\N
1ccda3bf-198a-486c-8c82-334d1422db3e	1ce5ed40-b6ce-4c63-b09e-50a0f93eba8a	delivered	123.00	Society: The Vienza | Flat: C1303 | Wallet Used: ₹30	2025-09-27 15:42:10.992	2025-09-14 19:49:58.63	wallet	2025-09-10	69.00	\N
9f538c46-6c37-43b4-a2a3-108f9e537a35	9051cac2-d198-410c-9e1a-12ddc09a0281	delivered	100.00	Society: The Vienza | Flat: C-202	2025-09-27 15:42:11.089	2025-09-14 19:41:45.079	cod	2025-09-10	0.00	\N
4eb96656-fb20-4234-948c-cefd3b6d4e95	30a179a7-bafe-4412-8383-0e194cfb6b6a	delivered	216.00	Society: The Vienza | Flat: C-1104	2025-09-27 15:42:11.181	2025-09-14 19:41:59.961	cod	2025-09-10	0.00	\N
2a18afd3-4d27-441a-a9ec-c66889fd32e9	508d35ee-9499-4a36-a86e-87aea14a19ee	delivered	360.00	Society: The Vienza | Flat: A-604	2025-09-27 15:42:11.259	2025-09-14 19:42:15.19	cod	2025-09-10	0.00	\N
0737e956-6491-4809-b91c-ca076f81502c	9ff0c02d-68e8-49a1-9c58-eac2876efcad	delivered	223.00	Society: The Vienza | Flat: C802	2025-09-27 15:42:11.287	2025-09-14 19:42:30.063	cod	2025-09-10	100.00	\N
45649b05-3995-4bb2-bdd0-8772918ada83	f9e98b36-4c63-4f48-8842-f2650e599429	delivered	156.00	Society: The Vienza | Flat: A-402	2025-09-27 15:42:11.449	2025-09-14 19:44:34.052	cod	2025-09-11	0.00	\N
a7c15b13-9641-4c9c-b943-c98524ec2d78	852b04f2-6161-4bc8-9c0e-25dfb21843ee	delivered	93.00	Society: The Vienza | Flat: A 902	2025-09-27 15:42:11.476	2025-09-14 19:44:47.735	cod	2025-09-11	0.00	\N
61329510-23b0-4736-b939-840d793f4da9	9296d5c2-7f35-4294-bdb1-508ac8610567	delivered	205.00	Society: Tulshi Heights | Flat: B-601	2025-09-27 15:42:11.502	2025-09-14 19:45:01.15	cod	2025-09-11	0.00	\N
c0606c43-6303-4fac-94ba-b99f0715a074	bbf2b0ae-1138-4c82-a9e8-5de175783faf	delivered	25.00	Society: The Vienza | Flat: A-403	2025-09-27 15:42:11.534	2025-09-14 19:45:15.368	cod	2025-09-11	0.00	\N
c0f61f72-2674-4dcb-8969-663a0bc2e092	508d35ee-9499-4a36-a86e-87aea14a19ee	delivered	60.00	Society: The Vienza | Flat: A-604	2025-09-27 15:42:11.557	2025-09-14 19:45:28.549	cod	2025-09-11	0.00	\N
40b468fe-59b6-4fb8-8ae5-6a88c978d313	83ba0368-cde5-4cd5-960b-89283d191b77	delivered	303.00	Society: The Vienza | Flat: A 1202	2025-09-27 15:42:11.579	2025-09-19 20:17:39.732	cod	2025-09-18	0.00	\N
636a8c7a-ce84-44de-bb8d-c57a0d409d21	c957abc0-fd67-4ad9-b9f4-de8a5ad4c6a1	delivered	366.00	Society: The Vienza | Flat: A803	2025-09-27 15:42:11.634	2025-09-19 20:18:30.418	cod	2025-09-18	15.00	\N
6fb38e7e-34db-4483-88fa-165a780eb550	bab4eb84-5c93-41c2-ba24-9de74fa5bfeb	delivered	185.00	Society: The Vienza | Flat: A-703	2025-09-27 15:42:12.834	2025-09-27 10:14:08.460212	cod	2025-09-24	0.00	\N
35c19c09-bf32-48e4-b429-9f829b69c29f	1288b864-f877-43de-bb38-a9fdf25139ba	delivered	145.00	Society: The Vienza | Flat: A-603	2025-09-27 15:42:12.78	2025-09-27 10:14:08.460276	cod	2025-09-24	0.00	\N
7ba206cd-a4a8-4c36-9019-512445c09e50	508d35ee-9499-4a36-a86e-87aea14a19ee	delivered	218.00	Society: The Vienza | Flat: A-604	2025-09-27 15:42:12.901	2025-09-27 10:14:08.463054	cod	2025-09-24	30.00	\N
61f01f8c-1dda-4fb1-b51b-131a4613f856	57953160-7717-404b-a36f-545877ff4064	delivered	163.00	Society: The Vienza | Flat: B 703	2025-09-27 15:42:12.863	2025-09-27 10:14:08.463063	cod	2025-09-24	0.00	\N
1393b251-cf29-400c-b894-80196ef1e9c4	83ba0368-cde5-4cd5-960b-89283d191b77	delivered	393.00	Society: The Vienza | Flat: A 1202	2025-09-27 15:42:12.929	2025-09-27 10:14:08.476224	cod	2025-09-24	0.00	\N
49b5e4fb-af4e-4fd0-a4d4-5bd99b361799	dbadc31c-00e1-4d7e-8be9-4a8627d32674	delivered	125.00	Society: Swarnim Stone | Flat: A302	2025-09-27 15:42:12.387	2025-09-19 20:17:08.634	cod	2025-09-18	25.00	\N
14032a8f-d7f2-480d-a3b9-dee3219a6fa1	b074c69d-6af7-4237-819e-87142d4d6c66	delivered	50.00	Society: Swranim Stown | Flat: C402	2025-09-27 15:42:12.413	2025-09-19 20:16:33.457	cod	2025-09-18	0.00	\N
0b9f08f8-06be-419a-bdf7-7e698fb9ead6	1ce5ed40-b6ce-4c63-b09e-50a0f93eba8a	delivered	80.00	Society: The Vienza | Flat: C1303 | Wallet Used: ₹30	2025-09-27 15:42:12.452	2025-09-19 20:15:55.488	wallet	2025-09-18	0.00	\N
22a1c1e8-6a5a-49db-ad80-e7f52bbd836b	57953160-7717-404b-a36f-545877ff4064	delivered	150.00	Society: The Vienza | Flat: B 703	2025-09-27 15:42:12.48	2025-09-20 14:37:31.825	cod	2025-09-20	30.00	\N
5ac2906d-b296-4765-81f2-ca825b4f25f6	0dfba9c7-26be-434a-8730-81bbba44d911	delivered	127.00	Society: The Vienza | Flat: B-902	2025-09-27 15:42:12.517	2025-09-20 14:37:53.809	cod	2025-09-20	27.00	\N
88ac84d9-fadc-42b0-9c01-581ea7fdc559	852b04f2-6161-4bc8-9c0e-25dfb21843ee	delivered	115.00	Society: The Vienza | Flat: A 902	2025-09-27 15:42:12.962	2025-09-27 10:14:08.476789	cod	2025-09-24	0.00	\N
f48f778c-a10a-4f9f-8d9d-5b0def8d1af2	c957abc0-fd67-4ad9-b9f4-de8a5ad4c6a1	delivered	451.00	Society: The Vienza | Flat: A803	2025-09-27 15:42:13.013	2025-09-27 10:14:08.478653	cod	2025-09-24	0.00	\N
6d86e17a-d0f3-4e6e-a90c-b2448215fbd9	bbf2b0ae-1138-4c82-a9e8-5de175783faf	delivered	55.00	Society: The Vienza | Flat: A-403	2025-09-27 15:42:13.041	2025-09-27 10:14:08.479227	cod	2025-09-24	0.00	\N
a612b63e-dbb5-42a7-9da3-6f78984efc85	7ff6ecf3-3c66-4b1b-a46d-751f1bf1ca03	delivered	262.00	Society: The Vienza | Flat: A-1004	2025-09-27 15:42:13.064	2025-09-27 10:14:08.481524	cod	2025-09-24	0.00	\N
fbda3c25-a49a-46fe-b185-a7f48abd2da3	91071c17-4d9a-4ba3-9696-b1ed80e85093	delivered	256.00	Society: The Vienza | Flat: C-1002	2025-09-27 15:42:13.09	2025-09-27 10:14:08.486996	cod	2025-09-24	0.00	\N
1219e1f8-56a5-4d19-8775-61b81577c1d5	9296d5c2-7f35-4294-bdb1-508ac8610567	delivered	225.00	Society: Tulshi Heights | Flat: B-601	2025-09-27 15:42:13.116	2025-09-27 10:14:08.491256	cod	2025-09-24	0.00	\N
456e2420-5328-4144-9ab1-9d851a6d1510	30a179a7-bafe-4412-8383-0e194cfb6b6a	delivered	251.00	Society: The Vienza | Flat: C-1104	2025-09-27 15:42:13.142	2025-09-27 10:14:08.491688	cod	2025-09-24	0.00	\N
bd08162d-c5a4-4dd1-a37e-c88aeccc6a46	31c134a9-aa1c-4841-bab3-dc6b4f839b85	delivered	185.00	Society: Swranim Stown | Flat: C-702	2025-09-27 15:42:13.168	2025-09-27 10:14:08.492668	cod	2025-09-24	0.00	\N
d03fa9b8-16bf-4052-8474-4a6832dd42ad	f9e98b36-4c63-4f48-8842-f2650e599429	delivered	306.00	Society: The Vienza | Flat: A-402	2025-09-27 15:42:12.749	2025-09-27 10:14:08.495295	cod	2025-09-24	0.00	\N
65916c58-7a94-4f9b-8692-4e26884a594e	bab4eb84-5c93-41c2-ba24-9de74fa5bfeb	delivered	75.00	Society: The Vienza | Flat: A-703	2025-09-27 15:42:12.696	2025-09-27 10:14:25.872611	cod	2025-09-20	15.00	\N
91fa4737-01f0-417c-b7a2-f7925df81472	9296d5c2-7f35-4294-bdb1-508ac8610567	delivered	223.00	Society: Tulshi Heights | Flat: B-601	2025-09-27 15:42:12.549	2025-09-27 10:14:25.872452	cod	2025-09-20	23.00	\N
7cc7a9e1-7ef3-4514-9410-89ddb645aa61	42db859d-2b6d-413a-995c-ecfcc592efec	delivered	105.00	Society: The Vienza | Flat: C-1001	2025-09-27 15:42:12.618	2025-09-27 10:14:25.872324	cod	2025-09-20	15.00	\N
61e36f4b-4963-4408-bfd9-88c3df6f2ac4	93e8e1b3-205a-4e0a-8c8e-477998a959c3	delivered	222.00	Society: Tulshi Heights | Flat: A301	2025-09-27 15:42:12.589	2025-09-27 10:14:25.873539	cod	2025-09-20	72.00	\N
d11d039d-4eb4-4cd7-a15b-5835f4bc49b9	bbf2b0ae-1138-4c82-a9e8-5de175783faf	delivered	25.00	Society: The Vienza | Flat: A-403	2025-09-27 15:42:12.674	2025-09-27 10:14:25.87625	cod	2025-09-20	5.00	\N
b284a663-1cf0-46d9-bdb4-05e5472cd1c6	f9e98b36-4c63-4f48-8842-f2650e599429	delivered	138.00	Society: The Vienza | Flat: A-402	2025-09-27 15:42:12.723	2025-09-27 10:14:25.88618	cod	2025-09-20	28.00	\N
9e186e3c-b864-4ccb-a39c-6965005de7a2	b10d3155-4939-4d12-b63b-e6c7f099b2c8	delivered	193.00	Society: The Vienza | Flat: A 704	2025-09-27 15:42:11.77	2025-09-27 10:14:25.886917	cod	2025-09-18	0.00	\N
23ba7684-c8e8-4a5d-bc6c-49375fdd60f6	98a27a1c-4f43-45f0-b6d8-2c5165327730	delivered	98.00	Society: The Vienza | Flat: C1403	2025-09-27 15:42:11.796	2025-09-27 10:14:25.888261	cod	2025-09-18	0.00	\N
1b9fe316-7b04-40c5-b7f6-b953ca8b4d94	575d4c3b-9545-4844-bee8-72f143e06588	delivered	100.00	Society: The Vienza | Flat: A-1102	2025-09-27 15:42:11.856	2025-09-27 10:14:25.888615	cod	2025-09-18	0.00	\N
b34037ba-ffd9-413d-85da-a7875ce4220e	73a77b18-546f-4295-b1ce-7ca9398f895d	delivered	134.00	Society: The Vienza | Flat: A 101	2025-09-27 15:42:11.983	2025-09-27 10:14:25.890945	cod	2025-09-18	0.00	\N
7d8828ea-a963-4e79-b99a-c7f729bbfd7e	bab4eb84-5c93-41c2-ba24-9de74fa5bfeb	delivered	151.00	Society: The Vienza | Flat: A-703	2025-09-27 15:42:11.957	2025-09-27 10:14:25.897044	cod	2025-09-18	0.00	\N
91422255-07e3-47ac-a40f-ff8d1b8300a3	bbf2b0ae-1138-4c82-a9e8-5de175783faf	delivered	55.00	Society: The Vienza | Flat: A-403	2025-09-27 15:42:12.015	2025-09-27 10:14:25.897338	cod	2025-09-18	0.00	\N
277efe81-2ceb-406d-942a-b7b799c0e133	d14804c1-315d-437a-9ae6-69f663268eef	delivered	271.00	Society: The Vienza | Flat: A-202	2025-09-27 15:42:12.085	2025-09-27 10:14:25.898462	cod	2025-09-18	0.00	\N
65ed19ce-e862-4bee-8cea-fa0163df452f	e3ed9081-7304-47e4-a96f-1269fc73810e	delivered	100.00	Society: The Vienza | Flat: B 802 | Wallet Used: ₹100	2025-09-27 15:42:12.202	2025-09-27 10:14:25.900454	wallet	2025-09-18	0.00	\N
91ca2bc2-cd5b-4f9c-aa1e-90e1916e0154	91071c17-4d9a-4ba3-9696-b1ed80e85093	delivered	336.00	Society: The Vienza | Flat: C-1002	2025-09-27 15:42:12.226	2025-09-27 10:14:25.902143	cod	2025-09-18	0.00	\N
45db82d2-05e6-4e53-9657-f6f96fd4b4c4	f9e98b36-4c63-4f48-8842-f2650e599429	delivered	194.00	Society: The Vienza | Flat: A-402	2025-09-27 15:42:12.311	2025-09-27 10:14:25.906368	cod	2025-09-18	0.00	\N
960ccdd7-ca08-443c-aba2-d5edb0da5a61	64e589f8-2394-4921-8351-b19082e45e59	delivered	30.00	Society: The Vienza | Flat: B602	2025-09-27 15:42:12.368	2025-09-27 10:14:25.908224	cod	2025-09-18	0.00	\N
bf8d3fe5-11c1-45c2-a7eb-c4f73ebb325d	b4c0c351-1d47-4bca-9470-121e91100db1	delivered	85.00	Society: The Vienza | Flat: A901	2025-09-27 15:42:11.816	2025-09-27 10:14:32.294964	cod	2025-09-18	0.00	\N
ba41f061-cdc1-4cda-95ba-e2caad43b20a	b6ed41d6-3855-4be9-8556-509649f98ea3	delivered	181.00	Society: The Vienza | Flat: C-503	2025-09-27 15:42:11.746	2025-09-27 10:14:32.295341	cod	2025-09-18	0.00	\N
f59dcdba-0e38-49ee-bb73-9c7102b6629d	82efca2c-eda9-4458-8eb9-a5746c0380f0	delivered	402.00	Society: The Vienza | Flat: A1001	2025-09-27 15:42:11.88	2025-09-27 10:14:32.296313	cod	2025-09-18	0.00	\N
ee16d2fd-a359-47ff-bade-c91f4e181e84	52e679f8-cd31-41f4-a453-8c709b9e525f	delivered	126.00	Flat: B 403	2025-09-27 15:42:12.115	2025-09-27 10:14:32.296784	cod	2025-09-18	0.00	\N
ed409bf6-456c-4f8b-b4b5-0593488334ed	64e589f8-2394-4921-8351-b19082e45e59	delivered	45.00	Society: The Vienza | Flat: B602	2025-09-27 15:42:12.061	2025-09-27 10:14:32.297206	cod	2025-09-18	0.00	\N
c8a8637b-5138-4dd2-9f56-8d24862caef2	4c20c147-b762-4842-a089-8cc3aed679eb	delivered	268.00	Society: The Vienza | Flat: C1101	2025-09-27 15:42:12.147	2025-09-27 10:14:32.303777	cod	2025-09-18	0.00	\N
fe3ba24e-4ef8-4169-bc9f-5e550c268d22	d5429c6e-5172-48ff-b24a-dd4a0896b9e3	delivered	210.00	Society: The Vienza | Flat: C702	2025-09-27 15:42:12.179	2025-09-27 10:14:32.31088	cod	2025-09-18	0.00	\N
e436780d-5e56-432c-80e8-a118a327560a	30a179a7-bafe-4412-8383-0e194cfb6b6a	delivered	406.00	Society: The Vienza | Flat: C-1104	2025-09-27 15:42:12.257	2025-09-27 10:14:32.311448	cod	2025-09-18	0.00	\N
c5586e27-9a9e-467c-a623-d13123e28509	3a05a7b5-8b15-4587-8c82-2f8c949b9f50	delivered	186.00	Society: The Vienza | Flat: B-1104	2025-09-27 15:42:12.342	2025-09-27 10:14:32.311834	cod	2025-09-18	0.00	\N
afaf9670-50ca-4039-843e-e98e8b5a598f	d93386aa-42b0-403a-998b-ac94c410a7fd	delivered	65.00	Society: The Vienza | Flat: A-602	2025-09-27 15:42:12.647	2025-09-27 16:24:19.707007	monthly	2025-09-20	0.00	6d7d0076-147e-4d21-a567-88ab74c31db2
a76335be-6f19-41db-bc70-5d587c420e5e	11dfff00-3c8b-416f-9a4a-3b7a1480083d	delivered	109.00	Society: The Vienza | Flat: A -802	2025-09-27 15:42:09.659	2025-09-08 20:44:44.661	monthly	2025-09-04	0.00	\N
0f99bd7d-0d30-4bc7-afa1-4b1524bdcef1	11dfff00-3c8b-416f-9a4a-3b7a1480083d	delivered	135.00	Society: The Vienza | Flat: A -802	2025-09-27 15:42:13.196	2025-09-27 10:14:08.493285	monthly	2025-09-24	0.00	\N
df7c45a4-259a-4cfa-9424-3f7b17111bbf	11dfff00-3c8b-416f-9a4a-3b7a1480083d	delivered	257.00	Society: The Vienza | Flat: A -802	2025-09-27 15:42:12.288	2025-09-27 10:14:32.311546	monthly	2025-09-18	0.00	\N
e09f842e-c118-42c4-bc05-3c009294a168	675b8827-9e6b-42b3-a9b0-aab88acfbdae	delivered	197.50	\N	2025-09-27 14:46:25.070606	2025-10-02 13:14:22.237742	cod	2025-09-28	0.00	\N
52bf724f-7b8d-409b-9aa5-b9b2a9d1ce62	e4033df6-94f0-4b62-bd9c-bd29307f8039	delivered	155.00	\N	2025-09-27 14:33:16.949196	2025-10-02 13:14:22.261988	cod	2025-09-28	0.00	\N
25d01dac-4465-4c93-bf45-022cea33aad3	bbf2b0ae-1138-4c82-a9e8-5de175783faf	delivered	92.50	\N	2025-09-27 14:39:46.785481	2025-10-02 13:14:22.275093	cod	2025-09-28	0.00	\N
710f6c4c-2900-48bb-925b-34e78c288271	42db859d-2b6d-413a-995c-ecfcc592efec	delivered	250.00	Society: The Vienza | Flat: C-1001	2025-09-27 15:42:13.227	2025-10-02 13:14:22.276739	cod	2025-09-27	0.00	\N
\.


--
-- TOC entry 3508 (class 0 OID 41382)
-- Dependencies: 219
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, "imageUrl", "createdAt", "updatedAt", "isAvailable", price, quantity, unit) FROM stdin;
0653ab92-5171-418b-89d2-9e6b60482bbb	કરેલા (Karela / Bitter Gourd)	\N	\N	2025-08-08 00:21:53.189	2025-08-08 00:21:53.189	t	30.00	500	gm
7687b526-7d4f-40e5-b274-c66cca337009	ફુલાવર (Band Gobi / Cauliflower)	\N	\N	2025-08-08 00:21:53.189	2025-09-17 20:05:41.13	t	50.00	1	pc
35660cc6-d186-4b87-9c97-3c07bbc5303f	મોટા લીલા મરચાં (Big Green Chili)	\N	\N	2025-08-08 00:21:53.189	2025-09-02 20:05:13.242	t	25.00	500	gm
7696b09f-900e-46d0-a68f-7b074580933a	લીલા વટાણા (Green Peas)	\N	\N	2025-08-08 00:21:53.189	2025-08-08 00:21:53.189	f	0.00	500	gm
2eae0636-1fa4-4d47-855f-306125787b1e	લીંબૂ (Lemon)	\N	\N	2025-08-08 00:21:53.189	2025-09-08 20:31:39.383	t	25.00	250	gm
97d66b60-b3da-41f0-a6b0-305cbb2fb464	તુરીયા (Turai / Ridge Gourd)	\N	\N	2025-08-08 00:21:53.189	2025-09-02 20:06:46.391	t	35.00	500	gm
fa51fd6b-fab5-4eea-8308-b50acb6e49f1	અદુ (Adu)	\N	\N	2025-08-08 00:21:53.189	2025-08-08 00:21:53.189	t	15.00	100	gm
be7965d2-e7ae-42dd-9731-b1195135005e	લીલી મગફળી (Lili Magfadi / Green Peanut)	\N	\N	2025-08-08 00:21:53.189	2025-09-08 20:33:04.657	t	50.00	500	gm
bd71ec96-c096-496b-9993-b560661cbb48	ગલકા – શાક માટે (Galka – For Sabji)	\N	\N	2025-09-17 20:27:35.378	2025-09-17 20:27:35.378	t	40.00	500	gm
56d2fd00-7f6d-42e6-8e9f-ab093f5b4817	Unknown Product (Placeholder)	Placeholder product for unmapped items during migration	\N	2025-09-20 06:51:45.66054	2025-09-20 06:51:45.66054	t	1.00	1	gm
feb933e8-b9cb-4046-978c-f8619c693eb5	લીલા રવૈયા (Lila Brinjal)	લીલા રવૈયા (Lila Brinjal)	\N	2025-09-17 20:07:37.991	2025-10-07 13:28:53.682031	t	50.00	500	gm
682089ef-89e9-4860-bfe0-e286ada294dd	કોબી (Gobi / Cabbage)	કોબી (Gobi / Cabbage)	\N	2025-08-08 00:21:53.189	2025-09-27 14:25:09.195408	t	20.00	1	pc
69a3bbb1-2538-40c2-8a1a-c5dc78485bb3	વાલોર (Valor Beans)	વાલોર	\N	2025-10-11 15:13:53.286845	2025-10-11 15:14:30.161979	t	50.00	500	gm
bc51aace-2385-4f8e-bcf7-dbae8d782ae5	ભીંડા (Lady Finger / Bhindi)	ભીંડા (Lady Finger / Bhindi)	\N	2025-08-08 00:21:53.189	2025-10-11 15:15:30.217426	t	40.00	500	gm
cba9a138-b913-47df-b1fa-61663c7603b0	ટમેટાં (Tomato)	ટમેટાં (Tomato)	\N	2025-08-08 00:21:53.189	2025-10-11 15:15:38.479126	t	40.00	500	gm
371c3ff4-639a-46a2-8103-95906e93fb5e	પાલક ભાજી (Palak Bhaji)	પાલક ભાજી (Palak Bhaji)	\N	2025-08-08 00:21:53.189	2025-10-02 13:17:05.76354	t	50.00	500	gm
c623d1cc-09b3-48ae-96c1-e996053ab84a	મેથી ભાજી (Methi Bhaji)	મેથી ભાજી (Methi Bhaji)	\N	2025-08-11 20:26:38.127	2025-10-02 13:17:41.30913	t	20.00	100	gm
43f5ae1c-ecad-4e22-9825-712dde5d647e	ગાજર (Carrot)	ગાજર (Carrot)	\N	2025-08-08 00:21:53.189	2025-10-02 13:18:07.667874	t	60.00	500	gm
7fded13b-5795-4f23-a8ba-c1c830755b18	નાની લીલી મરચી (Nani Lili Marchi)	નાની લીલી મરચી (Nani Lili Marchi)	\N	2025-08-11 20:39:28.16	2025-10-02 13:18:32.732888	t	30.00	500	gm
6c1e3d72-7d97-40bb-97b4-93059631140f	મકાઈ (Sweet Corn)	મકાઈ (Sweet Corn)	\N	2025-08-08 00:21:53.189	2025-10-02 13:19:31.402586	t	20.00	1	pc
d6c08c40-fc60-4556-b6b4-a6aa06cfbc05	કોથમીર (ધાણા ભાજી)Coriander	કોથમીર (ધાણા ભાજી)Coriander	\N	2025-09-09 18:24:15.224	2025-10-02 13:20:50.837688	t	20.00	100	gm
7a1f2b62-4324-47bb-9af9-b6edbf6169d6	રીંગણ (Brinjal - Gulabi Kathiyavadi Ringna)	રીંગણ (Brinjal - Gulabi Kathiyavadi Ringna)\n	\N	2025-08-08 00:21:53.189	2025-10-07 13:27:54.619552	t	50.00	500	gm
b0b7e903-3240-48fb-8ae8-b9bb9465a3fa	ગુવાર (Guvar)	ગુવાર (Guvar)	\N	2025-08-08 00:21:53.189	2025-10-11 15:16:00.029412	t	75.00	500	gm
81ee7d10-3404-4ae2-b740-8acf875e3ba2	ચોળી (Chawli)	ચોળી (Chawli)	\N	2025-08-08 00:21:53.189	2025-10-11 15:16:08.762535	t	70.00	500	gm
cda76cb0-5ecf-4cfe-a790-64c267cf5b09	શિમલા મરચાં (Capsicum)	શિમલા મરચાં (Capsicum)	\N	2025-08-08 00:21:53.189	2025-10-11 15:17:09.622409	t	80.00	500	gm
4dd7d0f0-a081-440c-b2d6-1932ab0f505c	🥒 દેશી કાકડી (Desi Kakdi)	🥒 દેશી કાકડી (Desi Kakdi)	\N	2025-08-08 00:21:53.189	2025-10-11 15:17:30.816378	t	30.00	500	gm
b9dda785-3136-4dbb-8cfd-3da82aff9b1c	ટિંડોરા (Tindora / Ivy Gourd)	ટિંડોરા (Tindora / Ivy Gourd)	\N	2025-08-08 00:21:53.189	2025-10-11 15:17:37.830836	t	75.00	500	gm
de8e800e-c915-4d26-9ff5-94701f51222d	દૂધી (Dudhi / Bottle Gourd) 🥒	દૂધી (Dudhi / Bottle Gourd) 🥒	\N	2025-09-09 18:30:07.91	2025-10-11 15:18:03.421479	t	40.00	500	gm
c1c3bf43-b581-408e-9317-57d81fa7ae00	પરવડ (Parvad)	પરવડ (Parvad)	\N	2025-08-08 00:21:53.189	2025-10-11 15:18:12.50074	t	80.00	500	gm
738a0900-9798-424c-a3f6-04a98bcf3848	બટાટા (Potato)	બટાટા (Potato)	\N	2025-08-08 00:21:53.189	2025-10-11 15:18:26.379129	t	35.00	1	kg
62dcf014-3edf-4e2e-9279-8b495822fc47	ધાણા ભાજીCoriander	ધાણા ભાજીCoriander	\N	2025-09-09 18:24:15.224	2025-10-11 15:24:28.78295	f	20.00	100	gm
93269f85-eae4-4983-9dfa-6b3620dbcbe6	તુવેર (Tuver Beans)	તુવેર (Tuver Beans)	\N	2025-10-11 16:12:42.909815	2025-10-11 16:12:42.909815	t	50.00	250	gm
\.


--
-- TOC entry 3510 (class 0 OID 41552)
-- Dependencies: 221
-- Data for Name: societies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.societies (id, name, address, "createdAt", "updatedAt") FROM stdin;
63fcd881-44c3-4ad7-b3e7-3546dcb1c2fd	The Vienza	Swranim stone road, Charodi	2025-09-13 10:40:07.245162	2025-09-13 10:40:07.245162
6e5d02a6-8a98-4f4a-beb2-6610757a9fed	Swranim Stone	Swranim Stone	2025-09-19 15:25:04.948425	2025-09-19 15:25:04.948425
126c6d3b-18ee-47f9-8735-1ea53de8ab24	Tulshi Heights	Address not provided	2025-09-19 15:53:25.526416	2025-09-19 15:53:25.526416
f2a28bff-0ea9-404f-aa7e-3dc990df35de	Other	Address not provided	2025-09-19 15:53:25.539181	2025-09-19 15:53:25.539181
9bd0f48a-c6a7-4a59-830b-6b9260ba7bc1	Satyamev Vista	Address not provided	2025-09-19 15:53:25.550874	2025-09-19 15:53:25.550874
92554ea2-b228-452f-a554-a98523f7730f	Seventh Parisar	Seventh Parisar	2025-10-07 15:32:23.852121	2025-10-07 15:32:23.852121
\.


--
-- TOC entry 3511 (class 0 OID 41569)
-- Dependencies: 222
-- Data for Name: wallet_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wallet_transactions (id, "walletId", amount, type, description, "createdAt") FROM stdin;
3e7a8855-1a89-4967-b574-30b0226487f5	4ebeae76-4b9f-43da-a307-20108657da07	500.00	credit	500 credited	2025-09-13 11:02:40.294946
1d03e344-138c-486c-806e-deee3ad89d0b	4ebeae76-4b9f-43da-a307-20108657da07	250.00	debit	250 remove	2025-09-13 11:04:07.79118
3958a135-ac1f-406d-b3d9-0f9f4e697c56	4ebeae76-4b9f-43da-a307-20108657da07	22.56	debit	Payment for order #fdac2022-fcfb-43cd-a21d-1abd04c712b7	2025-09-13 14:51:54.41955
15b433ae-a954-4396-be7c-fb4aacd11816	4ebeae76-4b9f-43da-a307-20108657da07	22.56	debit	Payment for order #4e291fe8-9600-4172-baa9-ef937d95326a	2025-09-13 14:52:03.938199
86a01adf-fdbb-4d27-a623-2dcd9f56d795	4ebeae76-4b9f-43da-a307-20108657da07	22.56	debit	Payment for order #107f3777-02e7-4d2e-a7c7-c41316fc71d6	2025-09-13 14:59:13.880617
576d12bb-aff5-4214-8773-d9d649d6b424	4ebeae76-4b9f-43da-a307-20108657da07	30.00	debit	Payment for order #8b3d75c2-d1e6-4e6a-9031-aaa897af198a	2025-09-13 15:02:14.777767
fb96a0cd-ef65-424b-98b2-42bee4c55117	4ebeae76-4b9f-43da-a307-20108657da07	52.50	debit	Payment for order #1727219c-c01b-478e-9cb0-6d00ff4f4725	2025-09-17 16:46:35.998245
a1405ec1-677a-44f4-81aa-a13dc90389e8	9caf4437-a4c6-46c6-8b57-8eb9be21e0b1	1000.00	credit	1000 added at 6th Aug (Adjustment: Manual credit)	2025-08-10 20:39:37.383
da6f2380-52bb-4793-b435-94a8f34c8502	9caf4437-a4c6-46c6-8b57-8eb9be21e0b1	90.00	debit	Order payment - Order #6898bc6a18fb2907899cc147 (Adjustment: New order) - Items: ટમેટાં (Tomato) (500 GM), બટાટા (Potato) (1 KG) [Order: 6898bc6a18fb2907899cc147]	2025-08-10 21:06:10.944
f98d1163-14d3-458e-a3cb-2cbf7f4fb34a	9caf4437-a4c6-46c6-8b57-8eb9be21e0b1	55.00	debit	Order payment - Order #689a070b9ddda4d26b7f3f68 (Adjustment: New order) - Items: ચોળી (Chawli) (250 GM), ગુવાર (Guvar) (250 GM) [Order: 689a070b9ddda4d26b7f3f68]	2025-08-11 20:36:51.272
21945ada-ff28-4aaf-a5bc-63a7cbec367b	9caf4437-a4c6-46c6-8b57-8eb9be21e0b1	55.00	credit	Reversal: Order updated - reversing original payment (Original: Order payment - Order #689a070b9ddda4d26b7f3f68) (Reversal: Order updated - reversing original payment) [REVERSAL] - Items: ચોળી (Chawli) (250 GM), ગુવાર (Guvar) (250 GM) [Order: 689a070b9ddda4d26b7f3f68]	2025-08-11 21:28:26.257
dd1b7847-7ef5-43f0-86a3-94cacb6dc681	9caf4437-a4c6-46c6-8b57-8eb9be21e0b1	75.00	debit	Order payment - Order #689a070b9ddda4d26b7f3f68 (Adjustment: New order) - Items: ચોળી (Chawli) (250 GM), ગુવાર (Guvar) (250 GM), ભીંડા (Lady Finger / Bhindi) (250 GM) [Order: 689a070b9ddda4d26b7f3f68]	2025-08-11 21:28:26.352
b1f7ced0-7074-45e4-b804-8938ffb607ce	9caf4437-a4c6-46c6-8b57-8eb9be21e0b1	75.00	debit	Order payment - Order #68a72154707de3310202c747 (Adjustment: New order) - Items: ચોળી (Chawli) (250 GM), ગુવાર (Guvar) (500 GM), ભીંડા (Lady Finger / Bhindi) (500 GM) [Order: 68a72154707de3310202c747]	2025-08-21 19:08:28.416
08f70927-8c68-4d4f-bb5d-00d3c0c33e62	7224109c-73f3-4ea4-aa1f-53d11fa47109	20.00	credit	Funds added (Adjustment: Manual credit)	2025-08-24 13:36:01.123
59326027-2999-4c9a-80a9-8e7b3220aed6	9caf4437-a4c6-46c6-8b57-8eb9be21e0b1	56.00	debit	Order payment - Order #68ab02c1d294fb51d7204e4a (Adjustment: New order) - Items: ટમેટાં (Tomato) (500 GM), કોબી (Gobi / Cabbage) (500 GM) [Order: 68ab02c1d294fb51d7204e4a]	2025-08-24 17:47:05.608
c15ed6fb-2b2c-4a34-8c7a-ed691730a2d4	7224109c-73f3-4ea4-aa1f-53d11fa47109	20.00	debit	Order payment - Order #68921bee4eca8fc1c78a4a69 (Adjustment: New order) - Items: મકાઈ (Sweet Corn) (4 PCS), ટમેટાં (Tomato) (500 GM), લીંબૂ (Lemon) (250 GM), ભીંડા (Lady Finger / Bhindi) (750 GM), તુરીયા (Turai / Ridge Gourd) (1 KG), ફુલાવર (Band Gobi / Cauliflower) (500 GM), ધાણા ભાજી (Dhana Bhaji / Coriander Leaves) (100 GM) [Order: 68921bee4eca8fc1c78a4a69]	2025-08-25 18:59:39.405
e7ffe727-1379-4fee-869f-d3fe71d42acf	9caf4437-a4c6-46c6-8b57-8eb9be21e0b1	75.00	debit	Order payment - Order #68922c044eca8fc1c78a4ac9 (Adjustment: New order) - Items: 🥒 દેશી કાકડી (Desi Kakdi) (500 GM), ચોળી (Chawli) (250 GM), ભીંડા (Lady Finger / Bhindi) (250 GM) [Order: 68922c044eca8fc1c78a4ac9]	2025-08-25 19:03:55.351
95e65bca-6bc4-4c6f-835f-7964a8e1e587	9caf4437-a4c6-46c6-8b57-8eb9be21e0b1	70.00	debit	Order payment - Order #68b8586045a10f811555aa5d (Adjustment: New order) - Items: ધાણા ભાજી (Dhana Bhaji / Coriander Leaves) (250 GM), કરેલા (Karela / Bitter Gourd) (250 GM), ગુવાર (Guvar) (500 GM) [Order: 68b8586045a10f811555aa5d]	2025-09-03 20:31:52.343
cf43c28a-2da2-48e5-b4ea-6545487e9bf2	9caf4437-a4c6-46c6-8b57-8eb9be21e0b1	75.00	credit	debit 75 by mastake\n (Adjustment: Manual credit)	2025-09-08 20:43:00.584
3138cc0b-946f-46ba-847e-16119c4baf22	e65985c2-90d9-42fe-8093-4b62a78d9287	30.00	credit	10 sept order 70rs and cash 100rs (Adjustment: Manual credit)	2025-09-10 20:36:27.441
76c76b16-5bb0-4830-b4c4-61182d49d9a6	9caf4437-a4c6-46c6-8b57-8eb9be21e0b1	38.00	debit	Order payment - Order #68c24aed2869f058dc5593e1 (Adjustment: New order) - Items:  (1 GM), ચોળી (Chawli) (250 GM), મોટા લીલા મરચાં (Big Green Chili) (250 GM) [Order: 68c24aed2869f058dc5593e1]	2025-09-11 09:37:09.442
167aebbf-0843-417c-aeb9-65c7c80a4245	e65985c2-90d9-42fe-8093-4b62a78d9287	30.00	debit	Order payment - Order #68c041487297ba68040b493a (Adjustment: New order) - Items: ફુલાવર (Band Gobi / Cauliflower) (250 GM), કોબી (Gobi / Cabbage) (1 PCS), બટાટા (Potato) (1 KG), મોટા લીલા મરચાં (Big Green Chili) (250 PCS),  (1 GM), ટિંડોરા (Tindora / Ivy Gourd) (250 GM) [Order: 68c041487297ba68040b493a]	2025-09-14 19:39:15.696
8ecbc828-84b0-4cc7-8248-7e72310192e3	e65985c2-90d9-42fe-8093-4b62a78d9287	30.00	credit	debit when deliver  (Adjustment: Manual credit)	2025-09-14 19:40:59.336
15d39ee3-b2ac-4dfc-b69c-0edd13c841c0	9caf4437-a4c6-46c6-8b57-8eb9be21e0b1	100.00	debit	Order payment - Order #68cad03648975814dae6f4bd (Adjustment: New order) - Items:  (1 GM), કોબી (Gobi / Cabbage) (1 PCS), ચોળી (Chawli) (500 GM) [Order: 68cad03648975814dae6f4bd]	2025-09-17 20:43:58.561
df172476-e152-4f55-8318-8b31bb96cb74	e65985c2-90d9-42fe-8093-4b62a78d9287	30.00	debit	Order payment - Order #68cae10748975814dae6f556 (Adjustment: New order) - Items:  (1 GM), ટમેટાં (Tomato) (250 GM), બટાટા (Potato) (1 KG), અદુ (Adu) (100 GM), કોથમીર (ધાણા ભાજી)Coriander (100 GM) [Order: 68cae10748975814dae6f556]	2025-09-19 20:15:55.575
7db681d8-6457-428e-bc55-8167d436e03a	4ebeae76-4b9f-43da-a307-20108657da07	40.00	debit	Payment for order #51cfeacd-4df1-42a8-8148-d8a786a1a9b8	2025-09-27 08:35:29.469572
ebd6b291-7145-4b24-a916-69e599582378	4ebeae76-4b9f-43da-a307-20108657da07	40.00	debit	Payment for order #67c60b37-c01f-4a98-a902-90a4b155caa3	2025-09-27 08:41:44.357678
ecb1a6fe-3d91-496f-96a8-009309f93a54	4ebeae76-4b9f-43da-a307-20108657da07	15.00	debit	Payment for order #360a2250-2b64-4563-8817-0d534c1957f9	2025-09-27 08:58:56.743445
534a4536-8b9a-4266-8f2e-93a72f6330a2	4ebeae76-4b9f-43da-a307-20108657da07	0.01	debit	4.82	2025-09-27 09:11:09.832723
b7185361-26f0-4c6c-9da9-f6ab918fd8cc	4ebeae76-4b9f-43da-a307-20108657da07	4.81	debit	test debit	2025-09-27 09:11:39.028359
9625fb76-b828-45ae-be47-668ea853abf8	4ebeae76-4b9f-43da-a307-20108657da07	1000.00	credit	add mony	2025-09-27 09:22:48.663718
8d9ebc03-2b83-466c-bb4b-01afb0f6049d	4ebeae76-4b9f-43da-a307-20108657da07	40.00	debit	Payment for order #46b85ad5-5bae-4f5f-a42b-7884dd3ab85f	2025-09-27 09:23:19.118645
47ba665d-cb54-4b02-acf0-9592df9cb941	4ebeae76-4b9f-43da-a307-20108657da07	40.00	debit	Payment for order #a4cfe0a9-a5f1-408b-acd6-3dbf9bf803f1	2025-09-27 09:26:50.289111
5d0df815-06db-49ea-85f7-97ef43a75c16	4ebeae76-4b9f-43da-a307-20108657da07	0.06	debit	Payment for order #870ee935-4781-40b7-9bf5-c8c959aeab77	2025-09-27 09:33:14.043285
0f671694-92e7-46de-85e9-6bd6904241a7	4ebeae76-4b9f-43da-a307-20108657da07	0.03	debit	Payment for order #7da0f76d-35dc-42b1-ae0f-bf297b15923c	2025-09-27 09:38:39.023575
9bc804f8-551e-46c2-8336-4cd5d28c564f	4ebeae76-4b9f-43da-a307-20108657da07	0.00	debit	Payment for order #62c94e02-a47f-4499-9c89-b055f09b3c97	2025-09-27 09:39:26.742731
d5b739ad-b352-4c90-9807-85fd24ffef1e	4ebeae76-4b9f-43da-a307-20108657da07	0.00	debit	Payment for order #ffc5803e-ae44-4323-aca6-a4a1cf7f5898	2025-09-27 10:03:00.339231
3582a1bb-1e39-4dbb-bca6-e3bc3ec08c8f	4ebeae76-4b9f-43da-a307-20108657da07	0.00	debit	Payment for order #36ef5e5c-a798-443d-9f80-e79cc8eb2e22	2025-09-27 10:05:10.237345
8724d0d7-3ff7-4cf2-be04-77405ed03e6e	4ebeae76-4b9f-43da-a307-20108657da07	0.00	debit	Payment for order #f0382a07-ae5a-43a6-bcd4-1b81ed95628e	2025-09-27 10:07:02.911418
3d32f25e-ee8d-491a-963d-789a3e3f087f	4ebeae76-4b9f-43da-a307-20108657da07	30.00	debit	Payment for order #b04c70ed-3044-47dd-8f9c-3f0702f21aa7	2025-09-27 10:08:20.150459
6a9c12c8-4ef9-49bc-bd8f-1e8dc964c8c7	4ebeae76-4b9f-43da-a307-20108657da07	40.00	debit	Payment for order #6d467f1e-8caa-455b-abc9-f57fea99ab38	2025-09-27 12:18:21.255587
af3b01e5-4260-4f89-8559-e9525a8ad883	4ebeae76-4b9f-43da-a307-20108657da07	60.00	debit	Payment for order #6d467f1e-8caa-455b-abc9-f57fea99ab38	2025-09-27 12:18:34.009243
7cd4e3d8-a837-4f12-bbb4-c6b523bcc4d7	4ebeae76-4b9f-43da-a307-20108657da07	15.00	credit	Refund for order #6d467f1e-8caa-455b-abc9-f57fea99ab38 modification	2025-09-27 12:18:57.380782
1080147e-ab02-4c3e-b8d2-386a9e12b024	9caf4437-a4c6-46c6-8b57-8eb9be21e0b1	95.00	debit	Payment for order #6e3b41ba-c95f-4af3-8ae9-d4931cd5bc76	2025-09-27 14:43:20.530997
19e46cc6-462a-4ad5-99a3-080b3adb63cd	9caf4437-a4c6-46c6-8b57-8eb9be21e0b1	55.00	debit	Payment for order #5d4312e3-f06a-4eeb-8146-7f5c735ad052	2025-10-02 14:38:25.144647
48907a53-811d-4f27-b11b-0f5fff47c591	dc011619-df8e-47b7-ab5f-81f1a44e384a	2000.00	credit	Wallet enable	2025-10-05 04:58:38.294099
08069071-03fc-47ee-9c35-b12554ca17f8	dc011619-df8e-47b7-ab5f-81f1a44e384a	153.50	debit	Payment for order #af5767d4-87a0-4a9b-a005-9e0e5812c813	2025-10-07 15:10:24.164354
a001d4ec-3334-41c2-b98b-199fc5c777fe	9caf4437-a4c6-46c6-8b57-8eb9be21e0b1	80.00	debit	Payment for order #3ecbf90c-f02e-4698-9c4b-807886106935	2025-10-11 15:33:00.68198
6e079ceb-c397-422c-b0af-b26fe11ef846	4c588348-aff9-4385-a0aa-a3bd37d26110	60.00	credit	jama	2025-10-12 06:16:03.704205
f4b202e6-2313-41c6-b412-1dfe7874420c	4c588348-aff9-4385-a0aa-a3bd37d26110	60.00	debit	debit	2025-10-12 06:16:24.362061
2a540868-00c6-4def-b2d7-0a77bb747534	81db5d7a-758f-473d-a61c-19568a1826e5	60.00	credit	Jama	2025-10-12 06:16:40.998847
\.


--
-- TOC entry 3512 (class 0 OID 41581)
-- Dependencies: 223
-- Data for Name: wallets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wallets (id, "customerId", balance, "createdAt", "updatedAt") FROM stdin;
cee01b56-d711-4fe5-bb30-465bcc35e17e	999fa389-feac-40b5-98e4-035c019ba582	0.00	2025-09-13 10:57:52.523412	2025-09-13 10:57:52.523412
9caf4437-a4c6-46c6-8b57-8eb9be21e0b1	e3ed9081-7304-47e4-a96f-1269fc73810e	266.00	2025-09-19 15:53:25.524669	2025-10-11 15:33:00.68198
de9dc9da-3b13-4111-acd1-c12c17b0a271	165c87f4-6ea0-4d4f-b231-b07ebcc299b0	0.00	2025-10-11 16:25:29.795565	2025-10-11 16:25:29.795565
cf5364e1-e96a-46d2-9692-e592bb5fc5ff	c11e2dc5-754b-45af-834f-3f037c91ab87	0.00	2025-10-11 16:28:50.507725	2025-10-11 16:28:50.507725
4c588348-aff9-4385-a0aa-a3bd37d26110	93e8e1b3-205a-4e0a-8c8e-477998a959c3	0.00	2025-09-19 15:53:25.606998	2025-10-12 06:16:24.362061
81db5d7a-758f-473d-a61c-19568a1826e5	9296d5c2-7f35-4294-bdb1-508ac8610567	60.00	2025-09-19 15:53:25.528804	2025-10-12 06:16:40.998847
93a57894-36e5-4bb3-aa9a-856bb34442a9	bab4eb84-5c93-41c2-ba24-9de74fa5bfeb	0.00	2025-09-19 15:53:25.497461	2025-09-19 15:53:25.497461
9edee997-860f-43e2-ad78-7b4ed5db60ed	31c134a9-aa1c-4841-bab3-dc6b4f839b85	0.00	2025-09-19 15:53:25.50439	2025-09-19 15:53:25.50439
2ed1f93b-7ba7-4af1-8dfc-b1f472af134c	1288b864-f877-43de-bb38-a9fdf25139ba	0.00	2025-09-19 15:53:25.506858	2025-09-19 15:53:25.506858
9cf1982d-b8c5-4dc8-92d3-33d11c57b316	508d35ee-9499-4a36-a86e-87aea14a19ee	0.00	2025-09-19 15:53:25.509361	2025-09-19 15:53:25.509361
a9262277-4759-4ea6-8600-bdd35d31f699	30a179a7-bafe-4412-8383-0e194cfb6b6a	0.00	2025-09-19 15:53:25.511901	2025-09-19 15:53:25.511901
4ba0cc87-d181-4990-9e9e-9b8bf1f7adb2	b6ed41d6-3855-4be9-8556-509649f98ea3	0.00	2025-09-19 15:53:25.514243	2025-09-19 15:53:25.514243
31639f98-c281-4879-aa87-654923fc9c3b	9051cac2-d198-410c-9e1a-12ddc09a0281	0.00	2025-09-19 15:53:25.517052	2025-09-19 15:53:25.517052
cf7741ac-3ab8-4db9-be06-3605d6b7d2a9	d93386aa-42b0-403a-998b-ac94c410a7fd	0.00	2025-09-19 15:53:25.518941	2025-09-19 15:53:25.518941
1e876df8-0e39-4406-828a-57b7b9de827d	df7645e2-ac6a-46fa-9244-164e79475367	0.00	2025-09-19 15:53:25.521009	2025-09-19 15:53:25.521009
aac21b09-471e-488f-9df6-a49df914cd6f	b10d3155-4939-4d12-b63b-e6c7f099b2c8	0.00	2025-09-19 15:53:25.522669	2025-09-19 15:53:25.522669
4e25e0d9-6866-4443-8d72-32985997f407	a433b5e7-f4d7-4bfc-951e-207a4f4a7b3e	0.00	2025-09-19 15:53:25.532699	2025-09-19 15:53:25.532699
9acb47ea-4302-4703-902a-b7a77ac41b37	b1ff0014-3714-4fb6-a6f2-e8d421667b93	0.00	2025-09-19 15:53:25.534288	2025-09-19 15:53:25.534288
2e19675a-7dd5-4193-b8dc-ee16fe23c3f7	d14804c1-315d-437a-9ae6-69f663268eef	0.00	2025-09-19 15:53:25.5358	2025-09-19 15:53:25.5358
ae23ca6c-d1c0-4807-a1f0-38dab6eac8a4	91071c17-4d9a-4ba3-9696-b1ed80e85093	0.00	2025-09-19 15:53:25.537526	2025-09-19 15:53:25.537526
2e8bd6c6-8881-479f-9a04-36d264c2de65	d4c3d6e2-c77a-4587-8008-3ba718606f6e	0.00	2025-09-19 15:53:25.542393	2025-09-19 15:53:25.542393
604f338e-42e2-47e1-a3c9-cfdb7d4aa30b	852b04f2-6161-4bc8-9c0e-25dfb21843ee	0.00	2025-09-19 15:53:25.543926	2025-09-19 15:53:25.543926
d3c35380-f7a9-4378-a151-d02f765f84f2	575d4c3b-9545-4844-bee8-72f143e06588	0.00	2025-09-19 15:53:25.545522	2025-09-19 15:53:25.545522
c1f92cf1-c027-4e7d-94a8-d59e0bb26a41	ead2fb47-aa53-4a26-b71b-7ddcdd78a5fa	0.00	2025-09-19 15:53:25.546749	2025-09-19 15:53:25.546749
06eb92ca-4d77-499d-83f0-07f1bb486b6e	3a05a7b5-8b15-4587-8c82-2f8c949b9f50	0.00	2025-09-19 15:53:25.549727	2025-09-19 15:53:25.549727
7224109c-73f3-4ea4-aa1f-53d11fa47109	08a309b7-6644-4e01-90fe-3fcd83586473	0.00	2025-09-19 15:53:25.553169	2025-09-19 15:53:25.553169
20d5cc41-a7f0-4ef6-aa84-0f46251dd9d0	482464d2-3ff6-4d81-ac05-495e9512d0b1	0.00	2025-09-19 15:53:25.554807	2025-09-19 15:53:25.554807
1395f024-1942-4219-a1d2-180298aa7541	73a77b18-546f-4295-b1ce-7ca9398f895d	0.00	2025-09-19 15:53:25.55615	2025-09-19 15:53:25.55615
56dba39c-d8d9-4f47-9a41-39388f152429	bbf2b0ae-1138-4c82-a9e8-5de175783faf	0.00	2025-09-19 15:53:25.557415	2025-09-19 15:53:25.557415
64375213-5ffa-46c7-8e0a-122c7977bc49	42db859d-2b6d-413a-995c-ecfcc592efec	0.00	2025-09-19 15:53:25.558725	2025-09-19 15:53:25.558725
a02c6414-dea1-4673-b8bf-65cc382c3c38	0dfba9c7-26be-434a-8730-81bbba44d911	0.00	2025-09-19 15:53:25.559986	2025-09-19 15:53:25.559986
ecae2f3b-6911-434e-9939-343157cef90c	78b4661c-3ce5-4159-8aa1-ea92b52f72d0	0.00	2025-09-19 15:53:25.561649	2025-09-19 15:53:25.561649
95dedc00-90e1-4bec-b961-38f44d0cee71	785142de-c2aa-43bb-ab19-851d6fdbf58a	0.00	2025-09-19 15:53:25.5629	2025-09-19 15:53:25.5629
9f35c910-fda8-4741-9f58-8830ba81af56	f9e98b36-4c63-4f48-8842-f2650e599429	0.00	2025-09-19 15:53:25.564301	2025-09-19 15:53:25.564301
76e7b7ef-fbe1-426e-b104-57e4ead1e476	45a7f3ee-7708-4f9c-8614-abd65f86fd2f	0.00	2025-09-19 15:53:25.566719	2025-09-19 15:53:25.566719
00c677a7-4dfe-4773-a64a-e24d758e540f	2ab70cad-148a-4518-907e-816134b23206	0.00	2025-09-19 15:53:25.568336	2025-09-19 15:53:25.568336
97138f5a-a217-4ae7-9973-5d1a2e5fa67d	4c20c147-b762-4842-a089-8cc3aed679eb	0.00	2025-09-19 15:53:25.5695	2025-09-19 15:53:25.5695
47a362ce-bdc1-44a9-a2a6-f63fa1b64649	77688538-8035-4580-8ec1-c565caa1ef17	0.00	2025-09-19 15:53:25.570809	2025-09-19 15:53:25.570809
ef7aa5a2-3ffb-47ee-af6d-33af8b53b098	11dfff00-3c8b-416f-9a4a-3b7a1480083d	0.00	2025-09-19 15:53:25.572028	2025-09-19 15:53:25.572028
93af6848-54a2-4705-b40c-6351d3f820b1	b3833c23-20c7-4f01-86b6-cfbe076177c8	0.00	2025-09-19 15:53:25.573258	2025-09-19 15:53:25.573258
0b1d8779-dce3-46d3-bba8-65fbc2bad848	59fb23ae-d1db-4848-81c3-dd81c18b9c03	0.00	2025-09-19 15:53:25.574467	2025-09-19 15:53:25.574467
d03577e8-b577-4b45-a4b5-c8fb451f1dea	aad02ebc-b79a-41da-aa7b-06063b213dcb	0.00	2025-09-19 15:53:25.575746	2025-09-19 15:53:25.575746
93509357-be83-4397-892b-bcda22c211c5	64e589f8-2394-4921-8351-b19082e45e59	0.00	2025-09-19 15:53:25.576919	2025-09-19 15:53:25.576919
a9af4b87-1bc7-41d9-a993-aa8d0f487050	f6d70034-ca4c-4fbf-a8bb-c52dc366eaa0	0.00	2025-09-19 15:53:25.578449	2025-09-19 15:53:25.578449
3eadbdd9-f612-4c58-bdd8-021ddb475c69	83ba0368-cde5-4cd5-960b-89283d191b77	0.00	2025-09-19 15:53:25.580177	2025-09-19 15:53:25.580177
a7cf88ae-810d-409e-9280-c39cc8a4d0d3	117e9890-424b-4214-ab5e-de1aa198da10	0.00	2025-09-19 15:53:25.581348	2025-09-19 15:53:25.581348
aeab5868-8c83-4053-afe9-97a5e273311a	82efca2c-eda9-4458-8eb9-a5746c0380f0	0.00	2025-09-19 15:53:25.582561	2025-09-19 15:53:25.582561
6ecdb02f-b363-453c-96a0-69a0bd6576dc	581736df-45e2-4d92-b3de-c5d1e075f05a	0.00	2025-09-19 15:53:25.583635	2025-09-19 15:53:25.583635
de072546-66c9-4391-a801-bc870fce491d	98a27a1c-4f43-45f0-b6d8-2c5165327730	0.00	2025-09-19 15:53:25.584995	2025-09-19 15:53:25.584995
fa14ee10-12c7-48ab-a84f-f15d07c39740	b572d8f9-3a0e-4b04-aaa1-fd0ed946244e	0.00	2025-09-19 15:53:25.586178	2025-09-19 15:53:25.586178
b56e6a31-ded2-43bd-a770-791abe403fe4	d5429c6e-5172-48ff-b24a-dd4a0896b9e3	0.00	2025-09-19 15:53:25.587297	2025-09-19 15:53:25.587297
4282b5a5-8f8f-450e-ae27-6c2538b90555	c957abc0-fd67-4ad9-b9f4-de8a5ad4c6a1	0.00	2025-09-19 15:53:25.588284	2025-09-19 15:53:25.588284
231b18b6-857b-44de-a871-aeac1ac2fa19	d3a63b74-30b5-4fa9-96dd-cc724fa26b54	0.00	2025-09-19 15:53:25.589294	2025-09-19 15:53:25.589294
b99f8828-5ebb-471c-916c-7cbd32f6bc26	b4c0c351-1d47-4bca-9470-121e91100db1	0.00	2025-09-19 15:53:25.590244	2025-09-19 15:53:25.590244
46f85dd2-a25a-4df6-ba42-473bba2008fa	e6027508-add9-4b40-9876-2e81be9e230b	0.00	2025-09-19 15:53:25.591538	2025-09-19 15:53:25.591538
9c693dff-86e0-4e2c-934a-87722446d089	89dcb597-d9eb-477e-846e-4656b66578a4	0.00	2025-09-19 15:53:25.593075	2025-09-19 15:53:25.593075
61e6fc7d-3918-4fbc-bd0f-826d8603925c	6187a88d-d45f-412d-bf18-a70288520cba	0.00	2025-09-19 15:53:25.594304	2025-09-19 15:53:25.594304
4c4a3307-8281-4450-b497-7942d5a58a40	e4033df6-94f0-4b62-bd9c-bd29307f8039	0.00	2025-09-19 15:53:25.595322	2025-09-19 15:53:25.595322
ff11f6b4-b81b-417b-b790-e3c3edc673a4	57953160-7717-404b-a36f-545877ff4064	0.00	2025-09-19 15:53:25.59628	2025-09-19 15:53:25.59628
0c556dd0-a55b-415b-a5f4-3ad2b6359aa5	52e679f8-cd31-41f4-a453-8c709b9e525f	0.00	2025-09-19 15:53:25.59726	2025-09-19 15:53:25.59726
e65985c2-90d9-42fe-8093-4b62a78d9287	1ce5ed40-b6ce-4c63-b09e-50a0f93eba8a	0.00	2025-09-19 15:53:25.598436	2025-09-19 15:53:25.598436
414a493e-2654-4a0a-9965-310d87939fd7	9ff0c02d-68e8-49a1-9c58-eac2876efcad	0.00	2025-09-19 15:53:25.59947	2025-09-19 15:53:25.59947
8b9d68cd-13d4-497c-a33a-d3389ce1cb15	dbadc31c-00e1-4d7e-8be9-4a8627d32674	0.00	2025-09-19 15:53:25.603908	2025-09-19 15:53:25.603908
e15580a6-467a-4e04-9df1-aaf959c0db2a	b074c69d-6af7-4237-819e-87142d4d6c66	0.00	2025-09-19 15:53:25.605156	2025-09-19 15:53:25.605156
4ebeae76-4b9f-43da-a307-20108657da07	fc232533-fa96-4b55-a790-b6ffd0078d84	789.91	2025-09-13 11:02:17.706172	2025-09-27 12:18:57.380782
8b5dfcb8-81c3-49b6-9317-a1bb67884a3c	e88595e2-5ee9-462d-b094-1a64c9379e04	0.00	2025-09-27 15:42:56.345362	2025-09-27 15:42:56.345362
146dcd52-3e99-4397-8fcd-d04c5d664fb0	675b8827-9e6b-42b3-a9b0-aab88acfbdae	0.00	2025-09-27 15:48:26.80114	2025-09-27 15:48:26.80114
8d74179d-40ba-4733-a0c1-187257d9b92f	ee1e1434-c633-4465-a0b5-daf76ce52557	0.00	2025-10-02 14:56:02.147921	2025-10-02 14:56:02.147921
eb8d991a-2120-49cb-8425-ff5099648add	3fc57ae6-1c69-4773-8e99-3277b4ccd098	0.00	2025-10-02 15:14:04.314188	2025-10-02 15:14:04.314188
d660a5ee-8a52-4300-88de-0273732d67c7	95483567-3c7b-43d0-9a20-86918e153a09	0.00	2025-10-03 15:24:21.099812	2025-10-03 15:24:21.099812
955f6289-f13b-4a74-8ad0-d7d377629fb2	cbdd5c3e-c7a8-4e41-90c9-feec771fff18	0.00	2025-10-07 15:07:25.786819	2025-10-07 15:07:25.786819
dc011619-df8e-47b7-ab5f-81f1a44e384a	7ff6ecf3-3c66-4b1b-a46d-751f1bf1ca03	1846.50	2025-09-19 15:53:25.54825	2025-10-07 15:10:24.164354
\.


--
-- TOC entry 3321 (class 2606 OID 41381)
-- Name: order_items PK_005269d8574e6fac0493715c308; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY (id);


--
-- TOC entry 3326 (class 2606 OID 41393)
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- TOC entry 3307 (class 2606 OID 41344)
-- Name: customers PK_133ec679a801fab5e070f73d3ea; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY (id);


--
-- TOC entry 3337 (class 2606 OID 41577)
-- Name: wallet_transactions PK_5120f131bde2cda940ec1a621db; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT "PK_5120f131bde2cda940ec1a621db" PRIMARY KEY (id);


--
-- TOC entry 3319 (class 2606 OID 41373)
-- Name: orders PK_710e2d4957aa5878dfe94e4ac2f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY (id);


--
-- TOC entry 3301 (class 2606 OID 41334)
-- Name: addresses PK_745d8f43d3af10ab8247465e450; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY (id);


--
-- TOC entry 3340 (class 2606 OID 41589)
-- Name: wallets PK_8402e5df5a30a229380e83e4f7e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY (id);


--
-- TOC entry 3348 (class 2606 OID 65934)
-- Name: monthly_bills PK_958fff1d129ea2f46aedf55205f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_bills
    ADD CONSTRAINT "PK_958fff1d129ea2f46aedf55205f" PRIMARY KEY (id);


--
-- TOC entry 3329 (class 2606 OID 41550)
-- Name: buildings PK_bc65c1acce268c383e41a69003a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT "PK_bc65c1acce268c383e41a69003a" PRIMARY KEY (id);


--
-- TOC entry 3332 (class 2606 OID 41561)
-- Name: societies PK_e0564d9c676def9b22cc88a02a9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.societies
    ADD CONSTRAINT "PK_e0564d9c676def9b22cc88a02a9" PRIMARY KEY (id);


--
-- TOC entry 3309 (class 2606 OID 41348)
-- Name: customers REL_9a1ba71f8651412e2003cfa46d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "REL_9a1ba71f8651412e2003cfa46d" UNIQUE ("addressId");


--
-- TOC entry 3342 (class 2606 OID 41591)
-- Name: wallets UQ_014befecbbc1dc6f0c649e33572; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT "UQ_014befecbbc1dc6f0c649e33572" UNIQUE ("customerId");


--
-- TOC entry 3350 (class 2606 OID 65936)
-- Name: monthly_bills UQ_226b5d6b85c7a1f06afac1798e5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_bills
    ADD CONSTRAINT "UQ_226b5d6b85c7a1f06afac1798e5" UNIQUE ("billNumber");


--
-- TOC entry 3311 (class 2606 OID 41594)
-- Name: customers UQ_3f09c42a2cd3f121353149ec2d6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "UQ_3f09c42a2cd3f121353149ec2d6" UNIQUE ("mobileNumber");


--
-- TOC entry 3313 (class 2606 OID 41346)
-- Name: customers UQ_8536b8b85c06969f84f0c098b03; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE (email);


--
-- TOC entry 3338 (class 1259 OID 41592)
-- Name: IDX_014befecbbc1dc6f0c649e3357; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_014befecbbc1dc6f0c649e3357" ON public.wallets USING btree ("customerId");


--
-- TOC entry 3333 (class 1259 OID 41578)
-- Name: IDX_024b4f997d0265a77d3b2f807b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_024b4f997d0265a77d3b2f807b" ON public.wallet_transactions USING btree ("createdAt");


--
-- TOC entry 3322 (class 1259 OID 41442)
-- Name: IDX_131ded477805d607c1ab1ea3b2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_131ded477805d607c1ab1ea3b2" ON public.products USING btree (unit);


--
-- TOC entry 3343 (class 1259 OID 65939)
-- Name: IDX_1d5ee10d6db4158b82f31a6264; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_1d5ee10d6db4158b82f31a6264" ON public.monthly_bills USING btree (status);


--
-- TOC entry 3314 (class 1259 OID 41374)
-- Name: IDX_1f4b9818a08b822a31493fdee9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_1f4b9818a08b822a31493fdee9" ON public.orders USING btree ("createdAt");


--
-- TOC entry 3344 (class 1259 OID 65938)
-- Name: IDX_22282877800b1e04f05c84dc99; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_22282877800b1e04f05c84dc99" ON public.monthly_bills USING btree ("billingMonth");


--
-- TOC entry 3327 (class 1259 OID 41551)
-- Name: IDX_3863b12a16557b6e0ee4c5162c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_3863b12a16557b6e0ee4c5162c" ON public.buildings USING btree (name, "societyId");


--
-- TOC entry 3302 (class 1259 OID 41596)
-- Name: IDX_3f09c42a2cd3f121353149ec2d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_3f09c42a2cd3f121353149ec2d" ON public.customers USING btree ("mobileNumber");


--
-- TOC entry 3323 (class 1259 OID 41396)
-- Name: IDX_4c9fb58de893725258746385e1; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_4c9fb58de893725258746385e1" ON public.products USING btree (name);


--
-- TOC entry 3315 (class 1259 OID 49510)
-- Name: IDX_4fc98f9e713466218e2d96fe8b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_4fc98f9e713466218e2d96fe8b" ON public.orders USING btree ("deliveryDate");


--
-- TOC entry 3316 (class 1259 OID 41653)
-- Name: IDX_775c9f06fc27ae3ff8fb26f2c4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_775c9f06fc27ae3ff8fb26f2c4" ON public.orders USING btree (status);


--
-- TOC entry 3303 (class 1259 OID 41351)
-- Name: IDX_8536b8b85c06969f84f0c098b0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_8536b8b85c06969f84f0c098b0" ON public.customers USING btree (email);


--
-- TOC entry 3304 (class 1259 OID 41350)
-- Name: IDX_88acd889fbe17d0e16cc4bc917; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_88acd889fbe17d0e16cc4bc917" ON public.customers USING btree (phone);


--
-- TOC entry 3334 (class 1259 OID 41580)
-- Name: IDX_8a94d9d61a2b05123710b325fb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_8a94d9d61a2b05123710b325fb" ON public.wallet_transactions USING btree ("walletId");


--
-- TOC entry 3335 (class 1259 OID 41579)
-- Name: IDX_9a4948382b69074d96e842e8fa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_9a4948382b69074d96e842e8fa" ON public.wallet_transactions USING btree (type);


--
-- TOC entry 3324 (class 1259 OID 41429)
-- Name: IDX_9cabac6d8bc37cae80163196a1; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_9cabac6d8bc37cae80163196a1" ON public.products USING btree ("isAvailable");


--
-- TOC entry 3345 (class 1259 OID 65937)
-- Name: IDX_a8583a803e5bb124afe62706a3; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_a8583a803e5bb124afe62706a3" ON public.monthly_bills USING btree ("createdAt");


--
-- TOC entry 3330 (class 1259 OID 41562)
-- Name: IDX_b09a5aefa2136f1f5444548ce3; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_b09a5aefa2136f1f5444548ce3" ON public.societies USING btree (name);


--
-- TOC entry 3305 (class 1259 OID 41349)
-- Name: IDX_b942d55b92ededa770041db9de; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_b942d55b92ededa770041db9de" ON public.customers USING btree (name);


--
-- TOC entry 3346 (class 1259 OID 65940)
-- Name: IDX_c7ea5a0ace5ec358bca780e7d2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_c7ea5a0ace5ec358bca780e7d2" ON public.monthly_bills USING btree ("customerId");


--
-- TOC entry 3317 (class 1259 OID 41672)
-- Name: IDX_cba090b1487ff777cf09edc41f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cba090b1487ff777cf09edc41f" ON public.orders USING btree ("paymentMode");


--
-- TOC entry 3360 (class 2606 OID 41607)
-- Name: wallets FK_014befecbbc1dc6f0c649e33572; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT "FK_014befecbbc1dc6f0c649e33572" FOREIGN KEY ("customerId") REFERENCES public.customers(id);


--
-- TOC entry 3351 (class 2606 OID 41612)
-- Name: customers FK_15348bf75e20dfdd784159fdc35; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "FK_15348bf75e20dfdd784159fdc35" FOREIGN KEY ("societyId") REFERENCES public.societies(id);


--
-- TOC entry 3358 (class 2606 OID 41597)
-- Name: buildings FK_7e9eb1ded9f652f2ebff9bd2b36; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT "FK_7e9eb1ded9f652f2ebff9bd2b36" FOREIGN KEY ("societyId") REFERENCES public.societies(id);


--
-- TOC entry 3359 (class 2606 OID 41602)
-- Name: wallet_transactions FK_8a94d9d61a2b05123710b325fbf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT "FK_8a94d9d61a2b05123710b325fbf" FOREIGN KEY ("walletId") REFERENCES public.wallets(id);


--
-- TOC entry 3352 (class 2606 OID 41400)
-- Name: customers FK_9a1ba71f8651412e2003cfa46d4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "FK_9a1ba71f8651412e2003cfa46d4" FOREIGN KEY ("addressId") REFERENCES public.addresses(id);


--
-- TOC entry 3353 (class 2606 OID 41617)
-- Name: customers FK_b43cf0b4779b5a5d2aa18c14e21; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "FK_b43cf0b4779b5a5d2aa18c14e21" FOREIGN KEY ("buildingId") REFERENCES public.buildings(id);


--
-- TOC entry 3361 (class 2606 OID 65941)
-- Name: monthly_bills FK_c7ea5a0ace5ec358bca780e7d23; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_bills
    ADD CONSTRAINT "FK_c7ea5a0ace5ec358bca780e7d23" FOREIGN KEY ("customerId") REFERENCES public.customers(id);


--
-- TOC entry 3356 (class 2606 OID 41415)
-- Name: order_items FK_cdb99c05982d5191ac8465ac010; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- TOC entry 3354 (class 2606 OID 41405)
-- Name: orders FK_e5de51ca888d8b1f5ac25799dd1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_e5de51ca888d8b1f5ac25799dd1" FOREIGN KEY ("customerId") REFERENCES public.customers(id);


--
-- TOC entry 3355 (class 2606 OID 65946)
-- Name: orders FK_f0a4c39458b1b20bb179736dd7f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_f0a4c39458b1b20bb179736dd7f" FOREIGN KEY ("monthlyBillId") REFERENCES public.monthly_bills(id);


--
-- TOC entry 3357 (class 2606 OID 41410)
-- Name: order_items FK_f1d359a55923bb45b057fbdab0d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON DELETE CASCADE;


-- Completed on 2025-10-12 12:13:32 IST

--
-- PostgreSQL database dump complete
--

\unrestrict V9Kghr8HTuOa6hgpD8eqcsmW6zxYyr62fTAIZnHkLVyBvwrajOvJdsfha6CgOmF

-- Completed on 2025-10-12 12:13:32 IST

--
-- PostgreSQL database cluster dump complete
--

