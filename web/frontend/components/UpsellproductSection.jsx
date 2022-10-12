import {
  Page,
  Layout,
  Card,
  Thumbnail,
  Link,
  Stack,
  Heading,
  Button,
  IndexTable,
  TextStyle,
  EmptyState,
  TextContainer,
  Pagination,
  Spinner,
  TextField,
} from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useCallback, useEffect, useState } from "react";
import { ToastComponent } from "./Tost";
// import { BannerComponent } from "./Banner";
import { useAuthenticatedFetch } from "../hooks";

export function UpsellProductSection() {
  const fetch = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [ResourcePickerState, setResourceState] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [upsellProductsInfo, setUpsellProductsInfo] = useState([]);
  const [active, setActive] = useState(false);
  const [content, setContent] = useState("");
  const [isError, setIsError] = useState(false);

  //Callback
    const toggleActive = useCallback(() => setActive((active) => !active), []);


    const handleUpsellProductsQuantityChange = (arrayIndex) => (ele) => {
        console.log(ele, "handleUpsellProductsQuantityChange");
        upsellProductsInfo[arrayIndex].upsellQuantity = ele;

        setUpsellProductsInfo([...upsellProductsInfo]);

    }
    // console.log(upsellProductsInfo,"After Handle");


  let ren = (
    <ToastComponent
      toggleActive={toggleActive}
      active={active}
      content={content}
      error={isError}
    />
  );

  const empty = (
    <Card>
      <EmptyState heading="">
        <p>
          TBefore you build your bundle, first create a product in Shopify.
          Here, you’ll assign the product as your bundle and add bundle items.
          <Link url="https://help.shopify.com/manual" external>
            Watch a video (2 min)
          </Link>
        </p>
      </EmptyState>
    </Card>
  );
  const resourceName = {
    singular: "customer",
    plural: "customers",
  };

  useEffect(() => {
    setIsLoading(true);
    getUpsellProducts();
  }, []);

  async function getUpsellProducts() {
    try {
      await fetch("/api/dashboard/getUpsellProducts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("getProducts ======>");
        //   setIsLoading(true);
            if (data.Response.data) {
              setSelectedProducts(data.Response.data.upsellProducts);
              setUpsellProductsInfo(data.Response.data.upsellProductsInfo);
              setContent("Get All Fragile Products");
              setIsError(false);
              setActive(true);
            } else {
              setContent("Select Fragile Products");
              setIsError(false);
              setActive(true);
            }
            setIsLoading(false);

          console.log("getProducts get fragile *******************");
          return data;
        });
    } catch (error) {
      console.log(`${error}`);
    }
  }

  async function postUpsellProducts(ele) {
    let obj1 = {
      upsellProducts: ele,
    };

    console.log(obj1, "postUpsellProducts");
    try {
      await fetch("/api/dashboard/selectUpSellProducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },

        body: JSON.stringify(obj1),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.Response, "******************");
          setSelectedProducts(data.Response.data.upsellProducts);
          setUpsellProductsInfo(data.Response.arr);
          setIsLoading(false);
          setContent(" All Upsell Products Updated");
          setIsError(false);
          setActive(true);
          return data;
        });
    } catch (error) {
      console.log(`${error}`);
    }
  }

  const rowMarkup = upsellProductsInfo.map((productele, index) => {
    return (
      <IndexTable.Row id={productele.id} key={productele.id} position={index}>
        <IndexTable.Cell>
          <Stack alignment="center">
            <Thumbnail
              source={productele.img ? productele.img : ImageMajor}
              alt="Black orange scarf"
              size="large"
            />
            <TextStyle>
              {productele.productName} <br /> {productele.selectedVariants}
            </TextStyle>
          </Stack>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {/* {productele.upsellQuantity} */}
          <TextField
            type="number"
            value={productele.upsellQuantity}
            onChange={handleUpsellProductsQuantityChange(index)}
          />
        </IndexTable.Cell>
        <IndexTable.Cell>{productele.upsellPriority}</IndexTable.Cell>
        {/* <IndexTable.Cell>Yes</IndexTable.Cell> */}

        {/* <IndexTable.Cell>
          <Button primary onClick={handleBundleProductsDelete(index)}>
            Deleted
          </Button>
        </IndexTable.Cell> */}
      </IndexTable.Row>
    );
  });

  return (
    <>
      <Page
        title="Products"
        primaryAction={
          <>
            <Button
              primary
              onClick={() => {
                setResourceState(true);
              }}
            >
              Select Products
            </Button>
          </>
        }
      >
        <ResourcePicker
          resourceType="Product"
          showVariants={true}
          open={ResourcePickerState}
          initialSelectionIds={selectedProducts}
          onCancel={() => {
            setResourceState(false);
          }}
          onSelection={(ele) => {
            setResourceState(false);
            // setIsLoading(true);
            //   let arr = [];
            let allProducts = ele.selection;
            allProducts.map((ele) => {
              Object.assign(ele, {
                upsellQuantity: 1,
                upsellPriority: "height",
              });
              // let obj = {
              //   img: product.image.src,
              //   productName: product.title,
              //   selectedVariants: `${ele.variants.length} of ${product.variants.length}`,
              // };
              // arr.push(obj);
            });
            console.log("====>", allProducts);
            postUpsellProducts(allProducts);
            setSelectedProducts(allProducts);
          }}
        />

        <Layout fullWidth>
          <Layout.Section oneThird>
            <div style={{ marginTop: "var(--p-space-5)" }}>
              <TextContainer>
                <Heading id="storeDetails">Select Product For Upsell</Heading>
                <p>
                  <TextStyle variation="subdued">
                    Shopify consigneeAddressand your customers will use this
                    information to contact you.
                  </TextStyle>
                </p>
              </TextContainer>
            </div>
          </Layout.Section>
          <Layout.Section>
            <Card>
              {isLoading ? (
                <div style={{ padding: "10% 50%" }}>
                  <Spinner accessibilityLabel="Spinner example" size="large" />
                </div>
              ) : // {
              selectedProducts.length == 0 ? (
                empty
              ) : (
                <Card>
                  <Card>
                    <Card.Section>
                      <IndexTable
                        resourceName={resourceName}
                        itemCount={selectedProducts.length}
                        loading={isLoading}
                        headings={[
                          { title: "Product" },
                          { title: "Quantity" },
                          { title: "Priority" },
                        ]}
                        selectable={false}
                      >
                        {rowMarkup}
                        {console.log("log-6", rowMarkup)}
                      </IndexTable>
                    </Card.Section>

                    <p
                      style={{
                        textAlign: "center",
                        width: "100%",
                        padding: "2%",
                      }}
                    >{`Showing ${selectedProducts.length} of ${selectedProducts.length} results`}</p>
                  </Card>
                  {/* <div className="pages">
                  <Pagination
                    hasPrevious
                    onPrevious={() => {
                      console.log("Previous");
                    }}
                    hasNext
                    onNext={() => {
                      console.log("Next");
                    }}
                  />
                </div> */}
                </Card>
              )}
              {/* } */}
            </Card>
          </Layout.Section>
        </Layout>
        {active ? ren : null}
      </Page>
    </>
  );
}
