import React, {useEffect, useState} from 'react';
import Layout from '../../components/layout/layout';
import { LinearProgress, TextField } from '@material-ui/core';
import withAuth from '../../HOCs/withAuth';
import useSections from './useSections';
import CardList from '../../components/card-list/CardList';
import {routerService, utilsService} from '../../services';

export default withAuth((props: any) => {
    const [sections] = useSections(props.match.params.id);
    const [filteredSections, setFilteredSections] = useState([]);

    useEffect(() => {
        setFilteredSections(sections);
    }, [sections]);

    function viewPages(section: any){
        routerService.goTo('pages', {id: section.id});
    }

    const sectionsGrid = (
        <>
                  <TextField
                        fullWidth
                        autoComplete="off"
                        className="searchBox"
                        id="outlined-secondary"
                        label="Search Sections"
                        variant="outlined"
                        onChange={(event: any) => {
                            const searchTxt = event.target.value.toLowerCase();
                            
                            const _filteredSections = sections.filter((section: any) => {
                                const sectionName = section.displayName.toLowerCase();
                                return utilsService.containsWord(sectionName, searchTxt);
                            });

                            setFilteredSections(_filteredSections);
                        }}
                    />
                    
                    <CardList displayPropName='displayName' onClick={viewPages} items={filteredSections || []}></CardList>
        </>
    );

    return (
        <Layout hideNavDrawer={true} routeInfo={routerService.getRouteInfo('sections')}>
            <>
                {
                    sections?.length > 0 ? sectionsGrid:  (<LinearProgress color="secondary" />)
                }
            </>
        </Layout>
    );
});