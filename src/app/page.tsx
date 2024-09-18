"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  isEmpty,
  isNumber,
  isValidEmail,
  isValidName,
  isValidPrice,
} from "@/utils/validation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/config/const";

interface City {
  _id: string;
  city_name: string;
}

export default function Home() {
  const router = useRouter();
  const [bidData, setBidData] = useState({
    name: "",
    email: "",
    city: "",
   
    price_willing_to_pay: "",
    special_instructions: "",
    what_you_need: "",
    delivery_address: "",
    payment_method: "",
  });

  const [dataErrors, setDataErrors] = useState({
    name: "",
    email: "",
    city: "",
  
    price_willing_to_pay: "",
    special_instructions: "",
    what_you_need: "",
    delivery_address: "",
    payment_method: "",
  });

  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "price_willing_to_pay" && !isValidPrice(value) && value !== "")
      return;

    setBidData({ ...bidData, [name]: value });
  };

  const handleClick = async () => {
    setDataErrors({
      name: "",
      email: "",
      city: "",
  
      price_willing_to_pay: "",
      special_instructions: "",
      what_you_need: "",
      delivery_address: "",
      payment_method: "",
    });

    let hasError = false;

    if (!isValidName(bidData.name)) {
      toast.error("Please enter a valid name");
      setDataErrors((prev) => ({ ...prev, name: "Please enter a valid name" }));
      hasError = true;
    }
    if (!isValidEmail(bidData.email)) {
      toast.error("Please enter a valid email");
      setDataErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email",
      }));
      hasError = true;
    }
    if (isEmpty(bidData.city)) {
      toast.error("Please select a city");
      setDataErrors((prev) => ({ ...prev, city: "Please select a city" }));
      hasError = true;
    }


    if (isEmpty(bidData.what_you_need)) {
      toast.error("Please specify what you need");
      setDataErrors((prev) => ({
        ...prev,
        what_you_need: "Please specify what you need",
      }));
      hasError = true;
    }
    if (isEmpty(bidData.delivery_address)) {
      toast.error("Please specify what you need");
      setDataErrors((prev) => ({
        ...prev,
        delivery_address: "Please enter your complete Address",
      }));
      hasError = true;
    }
    if (isEmpty(bidData.payment_method)) {
      toast.error("Please specify your payment method");
      setDataErrors((prev) => ({
        ...prev,
        payment_method: "Please select your payment method",
      }));
      hasError = true;
    }
    if (isEmpty(bidData.special_instructions)) {
      toast.error("Please enter any special instructions");
      setDataErrors((prev) => ({
        ...prev,
        special_instructions: "Please enter any special instructions",
      }));
      hasError = true;
    }

    if (!hasError) {
      try {
        setLoading(true);
        const res: AxiosResponse = await axios.post(
          `${baseUrl}/customers/create-bid`,
          bidData
        );
        if (res.status === 201) {
          toast.success("Bid has been created successfully");
          router.push("/order/success");
        }
      } catch (err: any) {
        const errMsg = Array.isArray(err.response.data.message)
          ? err.response.data.message[0]
          : err.response.data.message;
        toast.error(errMsg);
        setLoading(false);
      }
    }
  };

  const getAllCities = async () => {
    try {
      const res = await axios.get(`${baseUrl}/cities`);
      if (res.data?.data) {
        setCities(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch cities.");
    }
  };

  useEffect(() => {
    getAllCities();
  }, []);

  return (
      <div className="bg-slate-50 grainy-light">
        <section>
          <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-1 xl:pt-1 lg:pb-52">
            <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
              <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
                <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-2xl md:text-3xl lg:text-4xl">
                Delivery {" "}
                  <span className="bg-blue-500 px-2 text-white">Request</span>{" "}
                  through StayRunners
                </h1>
                <p className="mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
                Submit your delivery request with details such as delivery address, name, phone number, email, special instructions, product details, and total bid price.{" "}
                  <span className="font-semibold">Get the best rates </span>
                  <br />
                  <br />
                  <span className="font-semibold">Get notifications</span> and engage in negotiations with local runners through our AI Bot until a deal is reached.

                </p>

                <ul className="mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
            <div className="space-y-2">
              <li className="flex gap-1.5 items-center text-left">
                <Check className="h-5 w-5 shrink-0 text-blue-500" />
                Easy Delivery Requests
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <Check className="h-5 w-5 shrink-0 text-blue-500" />
                Negotiation with AI Bot
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <Check className="h-5 w-5 shrink-0 text-blue-500" />
                Secure Payments and Fees
              </li>
            </div>
          </ul>

                <div className="mt-20 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="flex flex-col justify-between items-center md:items-start">
                    <Link
                      href="/localhost/signup"
                      className={buttonVariants({
                        size: "sm",
                        className: "sm:flex items-center bg-blue-500 gap-1",
                      })}
                    >
                     Sign Up as a Runner
                    </Link>

                    <p className="text-xs mt-4">
                    Join our community of dedicated runners
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-2 lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit">
              <div className="relative w-full md:max-w-xl">
                <div className="w-full col-span-full lg:col-span-1 flex flex-col bg-white shadow-md">
                  <ScrollArea className="relative flex-1 overflow-auto">
                    <div
                      aria-hidden="true"
                      className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
                    />

                    <div className="px-8 pb-12 pt-8">
                      <h2 className="tracking-tight font-bold text-3xl">
                      Post Your Delivery Request

                      </h2>

                      <div className="w-full h-px bg-zinc-200 my-6" />

                      <div className="relative mt-4 h-full flex flex-col justify-between">
                        <div className="flex flex-col gap-6">
                          <div className="relative flex flex-col gap-1 w-full">
                            <Label
                              className={`${dataErrors.name && "text-red-600"}`}
                            >
                              Name
                            </Label>
                            <Input
                              name="name"
                              value={bidData.name}
                              onChange={handleChange}
                              placeholder="Enter your name"
                              className={`${dataErrors.name && "border-red-600"}`}
                            />
                            {dataErrors.name && (
                              <p className="text-red-600 text-sm">
                                {dataErrors.name}
                              </p>
                            )}
                          </div>

                          <div className="relative flex flex-col gap-1 w-full">
                            <Label
                              className={`${dataErrors.email && "text-red-600"}`}
                            >
                              Email
                            </Label>
                            <Input
                              name="email"
                              value={bidData.email}
                              onChange={handleChange}
                              placeholder="Enter your email"
                              className={`${dataErrors.email && "border-red-600"}`}
                            />
                            {dataErrors.email && (
                              <p className="text-red-600 text-sm">
                                {dataErrors.email}
                              </p>
                            )}
                          </div>

                          <div className="relative flex flex-col gap-1 w-full">
                            <Label
                              className={`${dataErrors.city && "text-red-600"}`}
                            >
                              City
                            </Label>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded="true"
                                  className={cn(
                                    "w-full justify-between",
                                    dataErrors.city && "border-red-600"
                                  )}
                                >
                                  {bidData.city
                                    ? cities.find(
                                      (city) => city._id === bidData.city
                                    )?.city_name
                                    : "Select city..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent className="max-h-[400px] overflow-auto">
                                {cities.map((city) => (
                                  <DropdownMenuItem
                                    key={city._id}
                                    onClick={() =>
                                      setBidData((prev) => ({
                                        ...prev,
                                        city: city._id,
                                      }))
                                    }
                                  >
                                    {city.city_name}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                            {dataErrors.city && (
                              <p className="text-red-600 text-sm">
                                {dataErrors.city}
                              </p>
                            )}
                          </div>





                          <div className="relative flex flex-col gap-1 w-full">
                            <Label
                              className={`${dataErrors.what_you_need && "text-red-600"
                                }`}
                            >
                              What you need
                            </Label>
                            <Input
                              name="what_you_need"
                              value={bidData.what_you_need}
                              onChange={handleChange}
                              placeholder="What do you need?"
                              className={`${dataErrors.what_you_need && "border-red-600"
                                }`}
                            />
                            {dataErrors.what_you_need && (
                              <p className="text-red-600 text-sm">
                                {dataErrors.what_you_need}
                              </p>
                            )}
                          </div>

                          <div className="relative flex flex-col gap-1 w-full">
                            <Label
                              className={`${dataErrors.delivery_address && "text-red-600"
                                }`}
                            >
                              Delivery Address
                            </Label>
                            <Input
                              name="delivery_address"
                              value={bidData.delivery_address}
                              onChange={handleChange}
                              placeholder="Complete Address?"
                              className={`${dataErrors.delivery_address && "border-red-600"
                                }`}
                            />
                            {dataErrors.delivery_address && (
                              <p className="text-red-600 text-sm">
                                {dataErrors.delivery_address}
                              </p>
                            )}
                          </div>
                          <div className="relative flex flex-col gap-1 w-full">
                            <Label
                              className={`${dataErrors.payment_method && "text-red-600"}`}
                            >
                              Payment Method
                            </Label>
                            <select
                              name="payment_method"
                              value={bidData.payment_method}
                              onChange={handleChange}
                              className={`${dataErrors.payment_method ? "border-red-600" : "border-gray-300"
                                } border rounded-md p-2`}
                            >
                              <option value="" disabled>
                                Select a payment method
                              </option>
                              <option value="cash_on_delivery">Cash on Delivery</option>
                              <option value="paypal">PayPal</option>
                              <option value="credit_card">Credit Card</option>
                            </select>
                            {dataErrors.payment_method && (
                              <p className="text-red-600 text-sm">
                                {dataErrors.payment_method}
                              </p>
                            )}
                          </div>


                          <div className="relative flex flex-col gap-1 w-full">
                            <Label
                              className={`${dataErrors.special_instructions && "text-red-600"
                                }`}
                            >
                              Special Instructions
                            </Label>
                            <Input
                              name="special_instructions"
                              value={bidData.special_instructions}
                              onChange={handleChange}
                              placeholder="Any special instructions?"
                              className={`${dataErrors.special_instructions &&
                                "border-red-600"
                                }`}
                            />
                            {dataErrors.special_instructions && (
                              <p className="text-red-600 text-sm">
                                {dataErrors.special_instructions}
                              </p>
                            )}
                          </div>

                          <div className="relative flex flex-col gap-1 w-full">
                            <Label>Price Willing to Pay</Label>
                            <Input
                              name="price_willing_to_pay"
                              value={bidData.price_willing_to_pay}
                              onChange={handleChange}
                              placeholder="Enter your price"
                            />
                          </div>

                          <Button
                            onClick={handleClick}
                            className="w-full mt-4"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting
                              </>
                            ) : (
                              <>
                                Submit Bid <ArrowRight className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </MaxWidthWrapper>
        </section>
      </div>
  );
}
